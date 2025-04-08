import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { GenericController } from '../common/generic.controller';

@Controller('user')
export class UserController extends GenericController<User> {
  constructor(private readonly userService: UserService) {
    super(userService);
  }
}