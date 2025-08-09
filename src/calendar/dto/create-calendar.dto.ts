import { IsString, IsNotEmpty, IsObject, ValidateNested, IsEmpty } from 'class-validator';
import { Type } from 'class-transformer';

// DTO para el objeto de fecha/hora del evento
export class EventDateTimeDto {
  @IsString()
  @IsNotEmpty()
  dateTime: string; // Formato: 'YYYY-MM-DDTHH:mm:ssZ' (ej. '2023-12-25T14:00:00-03:00')

  @IsString()
  @IsNotEmpty()
  timeZone: string; // Ej. 'America/Argentina/Buenos_Aires'
}

// DTO principal para la creación del evento
export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  summary: string; // Título del evento

  @IsString()
  @IsEmpty()
  description: string; // Descripción del evento

  @IsObject()
  @ValidateNested() // Valida el objeto anidado
  @Type(() => EventDateTimeDto) // Necesario para que class-transformer cree una instancia de EventDateTimeDto
  start: EventDateTimeDto;

  @IsObject()
  @ValidateNested()
  @Type(() => EventDateTimeDto)
  end: EventDateTimeDto;
}
