// src/users/dto/create-user.dto.ts
import { ApiExtraModels,ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsOptional, IsNotEmpty, MaxLength } from 'class-validator';

@ApiExtraModels()
export class CreateUserDto {
  @ApiProperty({ description: 'Email del usuario', example: 'user@example.com' })
  @IsEmail({}, { message: 'Debe ser un email válido' })
  @IsNotEmpty({ message: 'El email es requerido' })
  email: string;
@ApiProperty()
  @IsOptional()
  @IsString({ message: 'El apellido debe ser un palabra' })
  @MaxLength(100, { message: 'El apellido no puede tener más de 100 caracteres' })
  lastName?: string;
  @ApiProperty()
  @IsOptional()
  @IsString({ message: 'El nombre debe ser un palabra' })
  @MaxLength(100, { message: 'El nombre no puede tener más de 100 caracteres' })
  firstName?: string;
@ApiProperty()
  @IsOptional()
  @IsString({ message: 'El segundo nombre debe ser un palabra' })
  @MaxLength(100, { message: 'El segundo nombre no puede tener más de 100 caracteres' })
  middleName?: string;
}



