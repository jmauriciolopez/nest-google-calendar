import { Injectable,InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { CreateEventDto } from './dto/create-calendar.dto';
import { UpdateEventDto } from './dto/update-calendar.dto';
import { ConfigService } from '@nestjs/config';
import { google,calendar_v3  } from 'googleapis';
// import { OAuth2Client } from 'google-auth-library';

@Injectable()
export class CalendarService {

   private getCalendarClient(accessToken: string) {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });
    
    return google.calendar({ version: 'v3', auth: oauth2Client });
  }

  async listEvents(accessToken: string) {
    try {
      const calendar = this.getCalendarClient(accessToken);
      const res = await calendar.events.list({
        calendarId: 'primary', // 'primary' se refiere al calendario principal del usuario
        timeMin: new Date().toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
      });
      return res.data.items;
    } catch (error) {
      console.error('Error al listar eventos:', error);
      throw new InternalServerErrorException('No se pudieron obtener los eventos del calendario.');
    }
  }

  /**
   * Crea un nuevo evento en el calendario principal del usuario.
   * @param accessToken - El token de acceso del usuario.
   * @param createEventDto - Los datos del evento a crear.
   * @returns El evento creado.
   */
  async createEvent(accessToken: string, createEventDto: CreateEventDto) {
    try {
      const calendar = this.getCalendarClient(accessToken);
      const event = {
        summary: createEventDto.summary,
        description: createEventDto.description,
        start: {
          dateTime: createEventDto.start.dateTime,
          timeZone: createEventDto.start.timeZone,
        },
        end: {
          dateTime: createEventDto.end.dateTime,
          timeZone: createEventDto.end.timeZone,
        },
      };

      const res = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: event,
      });

      return res.data;
    } catch (error) {
      console.error('Error al crear el evento:', error);
      throw new BadRequestException('No se pudo crear el evento. Verifica los datos enviados.');
    }
  }

  /**
   * Elimina un evento del calendario principal del usuario.
   * @param accessToken - El token de acceso del usuario.
   * @param eventId - El ID del evento a eliminar.
   */
  async deleteEvent(accessToken: string, eventId: string) {
    try {
      const calendar = this.getCalendarClient(accessToken);
      await calendar.events.delete({
        calendarId: 'primary',
        eventId: eventId,
      });
      return { message: 'Evento eliminado exitosamente.' };
    } catch (error) {
      console.error('Error al eliminar el evento:', error);
      throw new InternalServerErrorException(`No se pudo eliminar el evento con ID: ${eventId}`);
    }
  } 
}
