// src/negocio/dto/update-negocio.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength } from 'class-validator';

export class UpdateNegocioDto {
  @ApiProperty({ description: 'Nombre del negocio', example: 'Mi Negocio' })
  @IsOptional()
  @IsString({ message: 'El nombre debe ser un texto' })
  @MaxLength(100, { message: 'El nombre no puede tener más de 100 caracteres' })
  name?: string;

  @ApiProperty({ description: 'Dirección del negocio', example: 'Calle Principal 123' })
  @IsOptional()
  @IsString({ message: 'La dirección debe ser un texto' })
  @MaxLength(200, { message: 'La dirección no puede tener más de 200 caracteres' })
  address?: string;

  @ApiProperty({ description: 'Teléfono del negocio', example: '1234567890' })
  @IsOptional()
  @IsString({ message: 'El teléfono debe ser un texto' })
  @MaxLength(20, { message: 'El teléfono no puede tener más de 20 caracteres' })
  phone?: string;
}