import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSkillDto {
  @ApiProperty({
    description: 'Designation or name of the skill',
    example: 'JavaScript',
  }) // Swagger annotation
  @IsNotEmpty()
  designation: string;
}