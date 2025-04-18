import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    description: 'Optional username of the user',
    example: 'john_doe_updated',
    required: false,
  })
  username?: string;

  @ApiProperty({
    description: 'Optional email address of the user',
    example: 'john_updated@example.com',
    required: false,
  })
  email?: string;

  @ApiProperty({
    description: 'Optional password of the user',
    example: 'newSecurePassword123',
    required: false,
    writeOnly: true,
  })
  password?: string;
}


//re-written just to add the @ApiProperty decorators.