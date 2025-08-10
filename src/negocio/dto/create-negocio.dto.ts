// src/negocio/dto/create-negocio.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateNegocioDto {
  @ApiProperty({ description: 'Nombre del negocio', example: 'Mi Negocio' })
  @IsString({ message: 'El nombre debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @MaxLength(100, { message: 'El nombre no puede tener más de 100 caracteres' })
  name: string;

  @ApiProperty({ description: 'Dirección del negocio', example: 'Calle Principal 123' })
  @IsString({ message: 'La dirección debe ser un texto' })
  @IsNotEmpty({ message: 'La dirección es requerida' })
  @MaxLength(200, { message: 'La dirección no puede tener más de 200 caracteres' })
  address: string;

  @ApiProperty({ description: 'Teléfono del negocio', example: '1234567890' })
  @IsString({ message: 'El teléfono debe ser un texto' })
  @IsNotEmpty({ message: 'El teléfono es requerido' })
  @MaxLength(20, { message: 'El teléfono no puede tener más de 20 caracteres' })
  phone: string;

  @ApiProperty({ description: 'Email del usuario asociado al negocio', example: 'user@example.com' })
  @IsString({ message: 'El email debe ser un texto' })
  @IsNotEmpty({ message: 'El email es requerido' })
  email: string;

  @ApiProperty({ description: 'Nombre del usuario asociado al negocio', example: 'John' })
  @IsString({ message: 'El nombre debe ser un texto' })
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @MaxLength(100, { message: 'El nombre no puede tener más de 100 caracteres' })
  firstName: string;

  @ApiProperty({ description: 'Apellido del usuario asociado al negocio', example: 'Doe' })
  @IsString({ message: 'El apellido debe ser un texto' })
  @IsNotEmpty({ message: 'El apellido es requerido' })
  @MaxLength(100, { message: 'El apellido no puede tener más de 100 caracteres' })
  lastName: string;
}