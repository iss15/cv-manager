import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateCvDto } from './create-cv.dto';

export class UpdateCvDto extends PartialType(CreateCvDto) {
  @ApiPropertyOptional({
    description: 'Optional name of the CV owner',
    example: 'John',
  })
  name?: string;

  @ApiPropertyOptional({
    description: 'Optional first name of the CV owner',
    example: 'Doe',
  })
  firstname?: string;

  @ApiPropertyOptional({
    description: 'Optional age of the CV owner',
    example: 30,
  })
  age?: number;

  @ApiPropertyOptional({
    description: 'Optional CIN (National ID) of the CV owner',
    example: '12345678',
  })
  cin?: string;

  @ApiPropertyOptional({
    description: 'Optional job title of the CV owner',
    example: 'Software Engineer',
  })
  job?: string;

  @ApiPropertyOptional({
    description: 'Optional path or URL of the CV image',
    example: '/uploads/cv-image.jpg',
  })
  path?: string;
}