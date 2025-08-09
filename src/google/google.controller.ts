// src/google/google.controller.ts

import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { GoogleService } from './google.service';
import { UsersService } from '../users/users.service';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';

@ApiTags('google')
@Controller('google')
export class GoogleController {
  constructor(
    private readonly googleService: GoogleService,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
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
//console.log('tokens:', tokens);
//console.log('profile:', profile);
    // Guardar usuario (o actualizar si ya existe)
    const user = await this.usersService.createOrUpdate(profile.email as string, profile.name as string);

    return {
      message: 'Usuario autenticado con Google',
      user,
      tokens,
    };
  }
  @Post('google/redirect')
async googleAuth(@Body() body: { token: string }) {
  const googleUser = await this.googleService.verifyGoogleToken(body.token);

  const user = await this.usersService.createOrUpdate(googleUser.email || '', googleUser.name);

  return this.authService.login(user); // retorna access_token firmado por vos
}
}
