import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // Import TypeOrmModule
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user.entity'; // Import the User entity
import { ProfileController } from './profile.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Register the User entity
  controllers: [UserController, ProfileController],
  providers: [UserService],
})
export class UserModule {}