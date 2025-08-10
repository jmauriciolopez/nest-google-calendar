import { IsOptional, IsString, MaxLength } from "class-validator";
import { ApiExtraModels,ApiProperty } from '@nestjs/swagger';

@ApiExtraModels()
export class UpdateUserDto {
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
  middleName?: string;
}