import { Transform } from 'class-transformer';
import { IsOptional, IsInt, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationDto {
  @ApiPropertyOptional({
    description: 'Page number for pagination (default is 1)',
    example: 1,
  }) // Swagger annotation for optional property
  @IsOptional()
  @Transform(({ value }) => parseInt(value) || 1) // Default to 1 if not provided
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page (default is 10)',
    example: 10,
  }) // Swagger annotation for optional property
  @IsOptional()
  @Transform(({ value }) => parseInt(value) || 7) // Default to 10 if not provided
  @IsInt()
  @Min(1)
  limit?: number = 7;
}