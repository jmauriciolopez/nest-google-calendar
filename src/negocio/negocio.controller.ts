// src/negocio/negocio.controller.ts

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  UsePipes,
  ValidationPipe,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
} from '@nestjs/common';
import { NegocioService } from './negocio.service';
import { CreateNegocioDto } from './dto/create-negocio.dto';
import { UpdateNegocioDto } from './dto/update-negocio.dto';
import { ApiTags, ApiHeader } from '@nestjs/swagger';
import { AuthApikeyGuard } from '../auth/authapikey';

@ApiTags('negocio')
@ApiHeader({
  name: 'apikey',
  description: 'API key',
})
@Controller('negocio')
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(AuthApikeyGuard)
export class NegocioController {
  constructor(private readonly negocioService: NegocioService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async create(@Body() createNegocioDto: CreateNegocioDto) {
    try {
      return await this.negocioService.create(createNegocioDto);
    } catch (error) {
      if (error.code === '23505') { // Código de error para violación de constraint único en PostgreSQL
        throw new BadRequestException('El email ya existe');
      }
      throw new InternalServerErrorException('Error al crear el negocio');
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.negocioService.findAll();
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener la lista de negocios');
    }
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      if (id <= 0) {
        throw new BadRequestException('El ID debe ser un número positivo');
      }

      const negocio = await this.negocioService.findOne(id);
      if (!negocio) {
        throw new NotFoundException(`Negocio con ID ${id} no encontrado`);
      }

      return negocio;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al buscar el negocio por ID');
    }
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateNegocioDto: UpdateNegocioDto,
  ) {
    try {
      if (id <= 0) {
        throw new BadRequestException('El ID debe ser un número positivo');
      }

      const existingNegocio = await this.negocioService.findOne(id);
      if (!existingNegocio) {
        throw new NotFoundException(`Negocio con ID ${id} no encontrado`);
      }

      return await this.negocioService.update(id, updateNegocioDto);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al actualizar el negocio');
    }
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    try {
      if (id <= 0) {
        throw new BadRequestException('El ID debe ser un número positivo');
      }

      const existingNegocio = await this.negocioService.findOne(id);
      if (!existingNegocio) {
        throw new NotFoundException(`Negocio con ID ${id} no encontrado`);
      }

      await this.negocioService.delete(id);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al eliminar el negocio');
    }
  }
}