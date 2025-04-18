import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreateSkillDto } from './create-skill.dto';

export class UpdateSkillDto extends PartialType(CreateSkillDto) {
  @ApiProperty({
    description: 'Optional designation or name of the skill',
    example: 'TypeScript',
    required: false,
  })
  designation?: string;
}