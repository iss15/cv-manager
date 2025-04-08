import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, ForbiddenException, UseInterceptors, UploadedFile } from '@nestjs/common';
import { CvService } from './cv.service';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { GetCvFilterDto } from './dto/get-cv-filter.dto'; 
import { FileInterceptor } from '@nestjs/platform-express';

@Controller({ path: 'cv', version: '1' })
export class CvController {
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
        return this.cvService.updateCvImageToPublicFolder(id, file.buffer, file.originalname);
      }

  @Get()
  async getCvs(@Query() filterDto: GetCvFilterDto) {
    return this.cvService.getFilteredCvs(filterDto);
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
