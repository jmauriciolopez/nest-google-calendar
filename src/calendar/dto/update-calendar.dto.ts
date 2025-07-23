import { PartialType } from '@nestjs/swagger';
import { CreateEventDto  } from './create-calendar.dto';

export class UpdateEventDto extends PartialType(CreateEventDto ) {}
