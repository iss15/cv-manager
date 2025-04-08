import { Controller, Get, Query, Post, Body, UseGuards, Req, Put, Param, Delete, Patch, ForbiddenException, UseInterceptors, UploadedFile } from '@nestjs/common';
import { CvService } from './cv.service';
import { GetCvFilterDto } from './dto/get-cv-filter.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller({ path: 'cv', version: '2' })
export class CvControllerV2 {
  constructor(private readonly cvService: CvService) {}
  
    @Post()
    async create(@Body() createCvDto: CreateCvDto, @Req() req: Request) {
      const userId = req['userId'];
      return this.cvService.create({ ...createCvDto, userId });
    }

    @Post('upload/:id')
    @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 1024 * 1024 } })) // 1MB limit
    async uploadCvImage(@Param('id') id: number, @UploadedFile() file: Express.Multer.File) {
      if (!file) {
        throw new Error('File is required');
      }
      return this.cvService.updateCvImage(id, file.buffer, file.originalname);
    }
  
    @Get()
    async getCvs(@Query() filterDto: GetCvFilterDto, @Query() paginationDto: PaginationDto) {
      return this.cvService.getFilteredCvs(filterDto, paginationDto);
    }
  
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.cvService.findOne(+id);
    }
  
    @Patch(':id')
    async update(@Param('id') id: string, @Body() updateCvDto: UpdateCvDto, @Req() req: Request) {
      const userId = req['userId'];
      const cv = await this.cvService.findOne(+id);
  
      if (cv.userId !== userId) {
        throw new ForbiddenException('You are not allowed to update this CV.');
      }
  
      return this.cvService.update(+id, updateCvDto);
    }
  
    @Delete(':id')
    async remove(@Param('id') id: string, @Req() req: Request) {
      const userId = req['userId'];
      const cv = await this.cvService.findOne(+id);
  
      if (cv.userId !== userId) {
        throw new ForbiddenException('You are not allowed to delete this CV.');
      }
  
      return this.cvService.remove(+id);
    }
}
