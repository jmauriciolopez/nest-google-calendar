import {
  IsEmail,
  IsString,
  MinLength,
  Matches,
  IsOptional,
} from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'El email no es válido' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

   @IsString()
  //   @Matches('password', {
  //     message: 'Las contraseñas no coinciden',
  //   })
  confirmPassword: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName: string;
}
