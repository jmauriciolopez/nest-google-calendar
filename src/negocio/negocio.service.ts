// src/negocio/negocio.service.ts

import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Negocio } from './negocio.entity';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { CreateNegocioDto } from './dto/create-negocio.dto';
import { UpdateNegocioDto } from './dto/update-negocio.dto';

@Injectable()
export class NegocioService {
  private readonly logger = new Logger(NegocioService.name);

  constructor(
    @InjectRepository(Negocio)
    private negocioRepository: Repository<Negocio>,
    private usersService: UsersService,
  ) {}

  async create(createNegocioDto: CreateNegocioDto): Promise<Negocio> {
    try {
      // Create the user associated with the negocio
       let user = await this.usersService.findByEmail(createNegocioDto.email);
      if (!user) {
        user = await this.usersService.createOrUpdate(
          createNegocioDto.email,
          createNegocioDto.lastName,
          createNegocioDto.firstName,
        );
      }
 

      // Create the negocio
      const negocio = this.negocioRepository.create({
        name: createNegocioDto.name,
        address: createNegocioDto.address,
        phone: createNegocioDto.phone,
        user,
      });

      return await this.negocioRepository.save(negocio);
    } catch (error) {
      this.logger.error('Error al crear el negocio', error.stack);
      throw error;
    }
  }

  async findAll(): Promise<Negocio[]> {
    try {
      return await this.negocioRepository.find({ relations: ['user'] });
    } catch (error) {
      this.logger.error('Error al obtener todos los negocios', error.stack);
      throw error;
    }
  }

  async findOne(id: number): Promise<Negocio | null> {
    try {
      return await this.negocioRepository.findOne({ where: { id }, relations: ['user'] });
    } catch (error) {
      this.logger.error(`Error al buscar negocio por ID: ${id}`, error.stack);
      throw error;
    }
  }

  async update(id: number, updateNegocioDto: UpdateNegocioDto): Promise<Negocio> {
    try {
      const negocio = await this.findOne(id);
      if (!negocio) {
        throw new Error(`Negocio con ID ${id} no encontrado`);
      }

      // Update the negocio fields
      Object.assign(negocio, updateNegocioDto);

      return await this.negocioRepository.save(negocio);
    } catch (error) {
      this.logger.error(`Error al actualizar negocio: ${id}`, error.stack);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      const negocio = await this.findOne(id);
      if (!negocio) {
        throw new Error(`Negocio con ID ${id} no encontrado`);
      }

      await this.negocioRepository.delete(id);
    } catch (error) {
      this.logger.error(`Error al eliminar negocio: ${id}`, error.stack);
      throw error;
    }
  }
}