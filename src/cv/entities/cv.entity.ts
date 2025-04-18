import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Skill } from '../../skill/entities/skill.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Cv {
  @ApiProperty({ description: 'Unique identifier for the CV', example: 1 }) // Swagger annotation
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Name of the CV owner', example: 'John' }) // Swagger annotation
  @Column()
  name: string;

  @ApiProperty({ description: 'First name of the CV owner', example: 'Doe' }) // Swagger annotation
  @Column()
  firstname: string;

  @ApiProperty({ description: 'Age of the CV owner', example: 30 }) // Swagger annotation
  @Column()
  age: number;

  @ApiProperty({ description: 'CIN (National ID) of the CV owner', example: '12345678' }) // Swagger annotation
  @Column()
  cin: string;

  @ApiProperty({ description: 'Job title of the CV owner', example: 'Software Engineer' }) // Swagger annotation
  @Column()
  job: string;

  @ApiProperty({ description: 'Path or URL of the CV image', example: '/uploads/cv-image.jpg', nullable: true }) // Swagger annotation
  @Column({ nullable: true }) // Nullable if the CV image is optional
  path: string;

  @ApiProperty({ description: 'ID of the user who owns the CV', example: 1 }) // Swagger annotation
  @Column()
  userId: number;

  @ApiProperty({ description: 'The user who owns the CV', type: () => User }) // Swagger annotation
  @ManyToOne(() => User, (user) => user.cvs)
  user: User;

  @ApiProperty({ description: 'List of skills associated with the CV', type: () => [Skill] }) // Swagger annotation
  @ManyToMany(() => Skill)
  @JoinTable()
  skills: Skill[];
}