import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateCvDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  firstname: string;

  @IsNumber()
  age: number;

  @IsNotEmpty()
  cin: string;

  @IsNotEmpty()
  job: string;

  @IsNotEmpty()
  path: string;
}