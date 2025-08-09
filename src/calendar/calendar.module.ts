import { Module } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CalendarController } from './calendar.controller';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Module({
  controllers: [CalendarController],
  providers: [CalendarService,JwtAuthGuard],
  exports: [CalendarService],
})
export class CalendarModule {}
