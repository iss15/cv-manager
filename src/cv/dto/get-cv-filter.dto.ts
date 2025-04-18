import { IsOptional, IsInt, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetCvFilterDto {
  @ApiPropertyOptional({
    description: 'Search term for filtering CVs by name, job, or other fields',
    example: 'Software Engineer',
  }) // Swagger annotation for optional property
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter CVs by age',
    example: 30,
  }) // Swagger annotation for optional property
  @IsOptional()
  @IsInt()
  age?: number;
}