// src/auth/auth.service.ts

import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/register.dto';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import { access } from 'fs';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
      private configService: ConfigService,
  ) {}

  googleLogin(req) {
    if (!req.user) {
      return {
      message: 'No user from google',
      user: req.user,
    }
     // return 'No user from google';
    }

    return {
      message: 'User information from google',
      user: req.user,
    };
  }

  generateJwt(user: any): string {
    if (!user || !user.googleId  || !user.email) {
      throw new Error('Invalid user data for JWT generation');
    }

    const payload = {
      sub: user.googleId,
      email: user.email,
      name: user.lastName && user.firstName
        ? `${user.lastName} ${user.firstName}`
        : user.name || 'Unknown User',
        accessToken: user.accessToken
    };

    return this.jwtService.sign(payload);
  }

  
  
  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    const { password: _, ...result } = user;
    return result;
  }

  async login(user: any) {
  const payload = { sub: user.id, email: user.email };
  return {
    access_token: this.jwtService.sign(payload),
  };
}

async logingoogle(googleToken: string): Promise<{ access_token: string }> {
    // Validación ficticia de GoogleToken. Aquí debes validar realmente.
    const tenantId = 'tenant123';
    const payload = { sub: 'user-id', tenant_id: tenantId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(registerDto: RegisterDto) {
  const { email, password, name } = registerDto;

  // Verificar si el usuario ya existe
  const existingUser = await this.usersService.findByEmail(email);
  if (existingUser) {
    throw new ConflictException('El email ya está registrado');
  }

  // Encriptar la contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  // Crear nuevo usuario
  const newUser = await this.usersService.create({
    email,
    password: hashedPassword,
    name,
  });

  // Generar token
  const payload = { email: newUser.email, sub: newUser.id };
  const token = this.jwtService.sign(payload);

  return {
    access_token: token,
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
    },
  };
}
async googleLoginold(req: any) {
    if (!req.user) {
      throw new UnauthorizedException('No user from Google');
    }

    const payload = {
      email: req.user.email,
      sub: req.user.googleId,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      picture: req.user.picture,
      accessToken: req.user.accessToken,
      refreshToken: req.user.refreshToken,
      provider: 'google',
      iat: Math.floor(Date.now() / 1000),
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        picture: req.user.picture,
      },
    };
  }

  async refreshGoogleToken(refreshToken: string) {
    // Implementar refresh de tokens de Google si es necesario
    const { google } = require('googleapis');
    
    const oauth2Client = new google.auth.OAuth2(
      this.configService.get<string>('GOOGLE_CLIENT_ID'),
      this.configService.get<string>('GOOGLE_CLIENT_SECRET'),
    );

    oauth2Client.setCredentials({
      refresh_token: refreshToken,
    });

    try {
      const { credentials } = await oauth2Client.refreshAccessToken();
      return credentials.access_token;
    } catch (error) {
      throw new UnauthorizedException('Token refresh failed');
    }
  }

  async getNewAccessToken(refreshToken: string) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
  );
  oauth2Client.setCredentials({ refresh_token: refreshToken });

  const { credentials } = await oauth2Client.refreshAccessToken();
  return credentials.access_token;
}
}