import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class GenericService<T extends Record<string, any>> {
  protected repository: Repository<T>;
  
  constructor(repository: Repository<T>) {
    this.repository = repository;
  }


  async findAll(): Promise<T[]> {
    return this.repository.find();
  }

  async findAllWithPagination(paginationDto: PaginationDto): Promise<{ data: T[]; total: number }> {
    const { page = 1, limit = 10 } = paginationDto;
    const [data, total] = await this.repository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
    });
    return { data, total };
  }

  async findOne(id: number): Promise<T> {
    const entity = await this.repository.findOne({ where: { id } } as any);
    if (!entity) {
      throw new Error(`Entity with id ${id} not found`);
    }
    return entity;
  }

  async create(data: Partial<T>): Promise<T> {
    return this.repository.save({ ...data } as T);
  }

  async update(id: number, data: Partial<T>): Promise<T> {
    await this.repository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}