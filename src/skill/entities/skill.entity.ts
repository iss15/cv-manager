import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Skill {
  @ApiProperty({ description: 'Unique identifier for the skill', example: 1 }) // Swagger annotation
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Designation or name of the skill', example: 'JavaScript' }) // Swagger annotation
  @Column()
  designation: string;
}