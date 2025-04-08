import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { GenericService } from '../common/generic.service';

@Injectable()
export class UserService extends GenericService<User> {
  constructor(@InjectRepository(User) repository: Repository<User>) {
    super(repository);
  }
}