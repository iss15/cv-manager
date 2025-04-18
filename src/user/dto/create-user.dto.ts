import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Unique } from 'src/common/validators/unique.validator';

export class CreateUserDto {
  @ApiProperty({ description: 'Username of the user', example: 'john_doe' }) // Swagger annotation
  @IsNotEmpty()
  @Unique('username', { message: 'Username must be unique' })
  username: string;

  @ApiProperty({ description: 'Email address of the user', example: 'john@example.com' }) // Swagger annotation
  @IsEmail()
  @Unique('email', { message: 'Email must be unique' })
  email: string;

  @ApiProperty({ description: 'Password of the user', example: 'securePassword123', writeOnly: true }) // Swagger annotation
  @IsNotEmpty()
  password: string;
}
