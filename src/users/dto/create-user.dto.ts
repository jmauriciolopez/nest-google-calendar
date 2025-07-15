// src/users/dto/create-user.dto.ts

import { IsEmail, IsString, IsOptional, IsNotEmpty, MaxLength } from 'class-validator';
 

export class CreateUserDto {
  @IsEmail({}, { message: 'Debe ser un email válido' })
  @IsNotEmpty({ message: 'El email es requerido' })
  email: string;

  @IsOptional()
  @IsString({ message: 'El nombre debe ser un string' })
  @MaxLength(100, { message: 'El nombre no puede tener más de 100 caracteres' })
  name?: string;
}

 



