// src/google/google.controller.ts

import { Controller, Get, Query } from '@nestjs/common';
import { GoogleService } from './google.service';
import { UsersService } from '../users/users.service';

@Controller('google')
export class GoogleController {
  constructor(
    private readonly googleService: GoogleService,
    private readonly usersService: UsersService,
  ) {}

  @Get('auth-url')
  getAuthUrl(): string {
    return this.googleService.generateAuthUrl();
  }

  @Get('redirect')
  async handleRedirect(@Query('code') code: string) {
    const tokens = await this.googleService.getTokens(code);

    // Recuperar datos del perfil
    const profile = await this.googleService.getUserProfile(tokens);

    // Guardar usuario (o actualizar si ya existe)
    const user = await this.usersService.createOrUpdate(profile.email as string, profile.name as string);

    return {
      message: 'Usuario autenticado con Google',
      user,
      tokens,
    };
  }
}
