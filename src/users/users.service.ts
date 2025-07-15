// src/users/users.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async createOrUpdate(email: string, name?: string): Promise<User> {
  let user = await this.findByEmail(email);
  if (!user) {
    user = this.usersRepository.create({ email, name });
    await this.usersRepository.save(user);
  }
  return user;
}

  async getAll(): Promise<User[]> {
    return this.usersRepository.find();
  }
}
