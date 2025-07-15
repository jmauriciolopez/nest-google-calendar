// src/users/users.controller.ts

import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Body, 
  Param, 
  UseGuards, 
  Request, 
  ParseIntPipe, 
  NotFoundException, 
  BadRequestException,
  InternalServerErrorException,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  ClassSerializerInterceptor,
  UseInterceptors,
  UnauthorizedException
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req): UserResponseDto {
  try {
      // Verificar que el usuario existe en la request
      if (!req.user) {
        throw new UnauthorizedException('Usuario no autenticado');
      }
      
      console.log('Usuario autenticado:', req.user); // Corrección del console.log
      return new UserResponseDto(req.user);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al obtener el perfil del usuario');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAll(): Promise<UserResponseDto[]> {
    try {
      const users = await this.usersService.getAll();
      return users.map(user => new UserResponseDto(user));
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener la lista de usuarios');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number): Promise<UserResponseDto> {
    try {
      if (id <= 0) {
        throw new BadRequestException('El ID debe ser un número positivo');
      }

      const user = await this.usersService.findById(id);
      
      if (!user) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      }

      return new UserResponseDto(user);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al buscar el usuario por ID');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('email/:email')
  async findByEmail(@Param('email') email: string): Promise<UserResponseDto> {
    try {
      // Validación básica del formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new BadRequestException('El formato del email no es válido');
      }

      const user = await this.usersService.findByEmail(email);
      
      if (!user) {
        throw new NotFoundException(`Usuario con email ${email} no encontrado`);
      }

      return new UserResponseDto(user);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al buscar el usuario por email');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async createOrUpdate(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    try {
      const user = await this.usersService.createOrUpdate(
        createUserDto.email,
        createUserDto.name
      );

      return new UserResponseDto(user);
    } catch (error) {
      if (error.code === '23505') { // Código de error para violación de constraint único en PostgreSQL
        throw new BadRequestException('El email ya existe');
      }
      throw new InternalServerErrorException('Error al crear o actualizar el usuario');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<UserResponseDto> {
    try {
      if (id <= 0) {
        throw new BadRequestException('El ID debe ser un número positivo');
      }

      const existingUser = await this.usersService.findById(id);
      if (!existingUser) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      }

      // Actualizar solo los campos proporcionados
      const updatedUser = await this.usersService.createOrUpdate(
        existingUser.email,
        updateUserDto.name || existingUser.name
      );

      return new UserResponseDto(updatedUser);
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al actualizar el usuario');
    }
  }
}