import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCvDto {
  @ApiProperty({
    description: 'Name of the CV owner',
    example: 'John',
  }) // Swagger annotation
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'First name of the CV owner',
    example: 'Doe',
  }) // Swagger annotation
  @IsNotEmpty()
  firstname: string;

  @ApiProperty({
    description: 'Age of the CV owner',
    example: 30,
  }) // Swagger annotation
  @IsNumber()
  age: number;

  @ApiProperty({
    description: 'CIN (National ID) of the CV owner',
    example: '12345678',
  }) // Swagger annotation
  @IsNotEmpty()
  cin: string;

  @ApiProperty({
    description: 'Job title of the CV owner',
    example: 'Software Engineer',
  }) // Swagger annotation
  @IsNotEmpty()
  job: string;

  @ApiProperty({
    description: 'Path or URL of the CV image',
    example: '/uploads/cv-image.jpg',
  }) // Swagger annotation
  @IsNotEmpty()
  path: string;
}