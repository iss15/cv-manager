import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, ForbiddenException, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { CvService } from './cv.service';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { GetCvFilterDto } from './dto/get-cv-filter.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('CV') // Group routes under the "CV" tag in Swagger
@ApiBearerAuth() // Require JWT authentication for these routes
@Controller({ path: 'cv', version: '1' })
export class CvController {
  constructor(private readonly cvService: CvService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new CV' }) // Describe the purpose of the route
  @ApiResponse({ status: 201, description: 'The CV has been successfully created.' }) // Document the response
  @ApiResponse({ status: 400, description: 'Invalid input.' }) // Document possible errors
  async create(@Body() createCvDto: CreateCvDto, @Req() req: Request) {
    const userId = req['userId'];
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
    return this.cvService.updateCvImageToPublicFolder(id, file.buffer, file.originalname);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve CVs with optional filters' }) // Describe the purpose of the route
  @ApiQuery({ name: 'search', required: false, description: 'Search term for filtering CVs' }) // Document the query parameter
  @ApiResponse({ status: 200, description: 'List of CVs.' }) // Document the response
  async getCvs(@Query() filterDto: GetCvFilterDto) {
    return this.cvService.getFilteredCvs(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a CV by ID' }) // Describe the purpose of the route
  @ApiParam({ name: 'id', description: 'ID of the CV to retrieve' }) // Document the route parameter
  @ApiResponse({ status: 200, description: 'The CV details.' }) // Document the response
  @ApiResponse({ status: 404, description: 'CV not found.' }) // Document possible errors
  findOne(@Param('id') id: string) {
    return this.cvService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a CV by ID' }) // Describe the purpose of the route
  @ApiParam({ name: 'id', description: 'ID of the CV to update' }) // Document the route parameter
  @ApiResponse({ status: 200, description: 'The CV has been successfully updated.' }) // Document the response
  @ApiResponse({ status: 403, description: 'Forbidden. You are not allowed to update this CV.' }) // Document possible errors
  @ApiResponse({ status: 404, description: 'CV not found.' }) // Document possible errors
  async update(@Param('id') id: string, @Body() updateCvDto: UpdateCvDto, @Req() req: Request) {
    const userId = req['userId'];
    const cv = await this.cvService.findOne(+id);

    if (cv.userId !== userId) {
      throw new ForbiddenException('You are not allowed to update this CV.');
    }

    return this.cvService.update(+id, updateCvDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a CV by ID' }) // Describe the purpose of the route
  @ApiParam({ name: 'id', description: 'ID of the CV to delete' }) // Document the route parameter
  @ApiResponse({ status: 200, description: 'The CV has been successfully deleted.' }) // Document the response
  @ApiResponse({ status: 403, description: 'Forbidden. You are not allowed to delete this CV.' }) // Document possible errors
  @ApiResponse({ status: 404, description: 'CV not found.' }) // Document possible errors
  async remove(@Param('id') id: string, @Req() req: Request) {
    const userId = req['userId'];
    const cv = await this.cvService.findOne(+id);

    if (cv.userId !== userId) {
      throw new ForbiddenException('You are not allowed to delete this CV.');
    }

    return this.cvService.remove(+id);
  }
}