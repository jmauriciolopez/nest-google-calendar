import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards ,Req} from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CreateEventDto  } from './dto/create-calendar.dto';
import { UpdateEventDto } from './dto/update-calendar.dto';
 
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
 
 

interface AuthenticatedUser {
  email: string;
  firstName: string;
  lastName: string;
  picture: string;
  accessToken: string;
}

interface RequestWithUser extends Request {
  user: AuthenticatedUser;
}

@ApiTags('calendar')
@Controller('calendar')
@UseGuards(JwtAuthGuard)
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get('events')
  async listEvents(@Req() req: Request) {
    // El AuthGuard('google') adjunta el usuario y sus tokens al objeto request
    const user = req.user as AuthenticatedUser;
    const accessToken = user.accessToken;
    return this.calendarService.listEvents(accessToken);
  }

  @Post('events')
  async createEvent(@Req() req: Request, @Body() createEventDto: CreateEventDto) {
    const user = req.user as AuthenticatedUser;
    const accessToken = user.accessToken;
    return this.calendarService.createEvent(accessToken, createEventDto);
  }

   

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.calendarService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCalendarDto: UpdateEventDto) {
  //   return this.calendarService.update(+id, updateCalendarDto);
  // }

 @Delete('events/:eventId')
  async deleteEvent(@Req() req: Request, @Param('eventId') eventId: string) {
    const user = req.user as AuthenticatedUser;
    const accessToken = user.accessToken;
    return this.calendarService.deleteEvent(accessToken, eventId);
  }
}
