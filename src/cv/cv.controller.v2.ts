import { Controller, Get, Query, Post, Body, UseGuards, Req, Put, Param, Delete, Patch, ForbiddenException, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { Response } from 'express';
import { CvService } from './cv.service';
import { GetCvFilterDto } from './dto/get-cv-filter.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('CV') 
@ApiBearerAuth() // Require JWT authentication for these routes
@UseGuards(JwtAuthGuard)
@Controller({ path: 'cv', version: '2' })
export class CvControllerV2 {
  constructor(private readonly cvService: CvService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new CV' }) // Describe the purpose of the route
  @ApiResponse({ status: 201, description: 'The CV has been successfully created.' }) // Document the response
  @ApiResponse({ status: 400, description: 'Invalid input.' }) // Document possible errors
  async create(@Body() createCvDto: CreateCvDto, @GetUser('userId') userId: number) { 
    return this.cvService.create({ ...createCvDto, userId });
  }

  @Post('upload/:id')
  @ApiOperation({ summary: 'Upload an image for a CV' }) // Describe the purpose of the route
  @ApiParam({ name: 'id', description: 'ID of the CV to upload the image for' }) // Document the route parameter
  @ApiResponse({ status: 200, description: 'The CV image has been successfully uploaded.' }) // Document the response
  @ApiResponse({ status: 400, description: 'File is required.' }) // Document possible errors
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 1024 * 1024 } })) // 1MB limit
  async uploadCvImage(@Param('id') id: number, @UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new Error('File is required');
    }
    return this.cvService.updateCvImage(id, file.buffer, file.originalname);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve CVs with optional filters and pagination' }) // Describe the purpose of the route
  @ApiQuery({ name: 'search', required: false, description: 'Search term for filtering CVs' }) // Document the query parameter
  @ApiResponse({ status: 200, description: 'List of CVs.' }) // Document the response
  async getCvs(
    @Query() filterDto: GetCvFilterDto,
    @Query() paginationDto: PaginationDto,
    @GetUser('userId') userId: number,
    @GetUser('role') role: string,
  ) {
    if (role === 'admin') {
      // Admins can retrieve all CVs with optional filters and pagination
      return this.cvService.getFilteredCvs(filterDto, paginationDto)
    }
   
    // Regular users can only retrieve their own CVs
    return this.cvService.getFilteredCvsByUser(userId, filterDto, paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a CV by ID' })  
  @ApiParam({ name: 'id', description: 'ID of the CV to retrieve' }) // Document the route parameter
  @ApiResponse({ status: 200, description: 'The CV details.' }) // Document the response
  @ApiResponse({ status: 404, description: 'CV not found.' }) // Document possible errors
  findOne(@Param('id') id: string) {
    return this.cvService.findOne(+id);
  }

  @Get('image/:id')
  async getCvImage(@Param('id') id: number, @Res() res: Response) {
    const { imageBuffer, contentType } = await this.cvService.getCvImage(id);
    res.setHeader('Content-Type', contentType);
    res.send(imageBuffer);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a CV by ID' }) // Describe the purpose of the route
  @ApiParam({ name: 'id', description: 'ID of the CV to update' }) // Document the route parameter
  @ApiResponse({ status: 200, description: 'The CV has been successfully updated.' }) // Document the response
  @ApiResponse({ status: 403, description: 'Forbidden. You are not allowed to update this CV.' }) // Document possible errors
  @ApiResponse({ status: 404, description: 'CV not found.' }) // Document possible errors
  async update(@Param('id') id: string, @Body() updateCvDto: UpdateCvDto, @GetUser('userId') userId: number, @GetUser('role') role: string) { 
    const cv = await this.cvService.findOne(+id);

    if (cv.userId !== userId && role !== 'admin') {
      throw new ForbiddenException('You are not allowed to update this CV.');
    }

    return this.cvService.update(+id, updateCvDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a CV by ID' })
  @ApiParam({ name: 'id', description: 'ID of the CV to delete' })
  @ApiResponse({ status: 200, description: 'The CV has been successfully deleted.' })
  @ApiResponse({ status: 403, description: 'Forbidden. You are not allowed to delete this CV.' })
  @ApiResponse({ status: 404, description: 'CV not found.' })
  async remove(@Param('id') id: string, @GetUser('userId') userId: number, @GetUser('role') role: string) {
    // Delegate the logic to the service
    return this.cvService.deleteCv(+id, userId, role);
  }
}