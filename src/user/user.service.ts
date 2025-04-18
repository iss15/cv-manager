import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { GenericService } from '../common/services/generic.service';

@Injectable()
export class UserService extends GenericService<User> {
  constructor(@InjectRepository(User) repository: Repository<User>) {
    super(repository);
  }

  async updateProfile(userId: number, updateData: Partial<User>, currentUser: User): Promise<User> {
    // Check if the current user is an admin or updating their own profile
    if (currentUser.role !== 'admin' && currentUser.id !== userId) {
      throw new ForbiddenException('You are not allowed to update this profile.');
    }

    // Proceed with the update
    await this.repository.update(userId, updateData);
    const user = await this.repository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async deleteProfile(userId: number, currentUser: User): Promise<void> {
    // Check if the current user is an admin or deleting their own profile
    if (currentUser.role !== 'admin' && currentUser.id !== userId) {
      throw new ForbiddenException('You are not allowed to delete this profile.');
    }
  
    // Proceed with the deletion
    const user = await this.repository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
  
    await this.repository.delete(userId);
  }
  
}