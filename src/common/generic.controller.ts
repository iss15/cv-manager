import { Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { GenericService } from './generic.service';

export abstract class GenericController<T extends Record<string, any>> {
  constructor(private readonly service: GenericService<T>) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.service.findOne(id);
  }

  @Post()
  create(@Body() data: Partial<T>) {
    return this.service.create(data);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() data: Partial<T>) {
    return this.service.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.service.remove(id);
  }
}
