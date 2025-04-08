import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // Import TypeOrmModule
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity'; // Import the User entity

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Register the User entity
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}