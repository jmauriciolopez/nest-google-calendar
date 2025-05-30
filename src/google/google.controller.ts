// src/google/google.controller.ts

import { Controller, Get, Query } from '@nestjs/common';
import { GoogleService } from './google.service';

@Controller('google')
export class GoogleController {
  constructor(private readonly googleService: GoogleService) {}

  @Get('auth-url')
  getAuthUrl(): string {
    return this.googleService.generateAuthUrl();
  }

  @Get('redirect')
  async handleRedirect(@Query('code') code: string) {
    const tokens = await this.googleService.getTokens(code);
    return tokens;
  }

  @Get('events')
  async getEvents(@Query('access_token') access_token: string, @Query('refresh_token') refresh_token: string) {
    const tokens = { access_token, refresh_token };
    return this.googleService.listEvents(tokens);
  }
}
