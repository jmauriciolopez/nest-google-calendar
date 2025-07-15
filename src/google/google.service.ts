// src/google/google.service.ts

import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleService {
  private oauth2Client;

  constructor(private configService: ConfigService) {
    this.oauth2Client = new google.auth.OAuth2(
      this.configService.get('GOOGLE_CLIENT_ID'),
      this.configService.get('GOOGLE_CLIENT_SECRET'),
      this.configService.get('GOOGLE_REDIRECT_URI'),
    );
  }

  generateAuthUrl(): string {
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/calendar'],
    });
  }

async getUserProfile(tokens: any) {
  this.oauth2Client.setCredentials(tokens);
  const oauth2 = google.oauth2({ version: 'v2', auth: this.oauth2Client });
  const { data } = await oauth2.userinfo.get();
  return {
    email: data.email,
    name: data.name,
  };
}

  async getTokens(code: string) {
    const { tokens } = await this.oauth2Client.getToken(code);
    return tokens;
  }

  async listEvents(tokens: any) {
    this.oauth2Client.setCredentials(tokens);

    const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });

    const events = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });

    return events.data.items;
  }

  async createEvent(tokens: any, event: any) {
    this.oauth2Client.setCredentials(tokens);

    const calendar = google.calendar({ version: 'v3', auth: this.oauth2Client });

    const res = await calendar.events.insert({
      calendarId: 'primary',
      requestBody: event,
    });

    return res.data;
  }
}
