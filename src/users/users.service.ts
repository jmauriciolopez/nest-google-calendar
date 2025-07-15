// src/users/users.service.ts

import { Injectable ,Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserNotFoundException, UserAlreadyExistsException } from '../common/exceptions/user.exception';


@Injectable()
export class UsersService {
   private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.usersRepository.findOne({ where: { email } });
    } catch (error) {
      this.logger.error(`Error al buscar usuario por email: ${email}`, error.stack);
      throw error;
    }
  }

  async findById(id: number): Promise<User | null> {
    try {
      return await this.usersRepository.findOne({ where: { id } });
    } catch (error) {
      this.logger.error(`Error al buscar usuario por ID: ${id}`, error.stack);
      throw error;
    }
  }

  async createOrUpdate(email: string, name?: string): Promise<User> {
    try {
      let user = await this.findByEmail(email);
      
      if (!user) {
        user = this.usersRepository.create({ email, name });
        this.logger.log(`Creando nuevo usuario: ${email}`);
      } else {
        // Actualizar solo si hay cambios
        if (name && name !== user.name) {
          user.name = name;
          this.logger.log(`Actualizando usuario: ${email}`);
        }
      }
      
      return await this.usersRepository.save(user);
    } catch (error) {
      this.logger.error(`Error al crear/actualizar usuario: ${email}`, error.stack);
      throw error;
    }
  }

  async getAll(): Promise<User[]> {
    try {
      return await this.usersRepository.find();
    } catch (error) {
      this.logger.error('Error al obtener todos los usuarios', error.stack);
      throw error;
    }
  }

  async deleteUser(id: number): Promise<void> {
    try {
      const user = await this.findById(id);
      if (!user) {
        throw new UserNotFoundException(id);
      }

      await this.usersRepository.delete(id);
      this.logger.log(`Usuario eliminado: ${id}`);
    } catch (error) {
      this.logger.error(`Error al eliminar usuario: ${id}`, error.stack);
      throw error;
    }
  }
  async create(data: { email: string; password: string; name?: string }): Promise<User> {
  const existingUser = await this.findByEmail(data.email);

  if (existingUser) {
    throw new UserAlreadyExistsException(data.email);
  }

  const newUser = this.usersRepository.create({
    email: data.email,
    password: data.password,
    name: data.name,
  });

  return this.usersRepository.save(newUser);
}

}
