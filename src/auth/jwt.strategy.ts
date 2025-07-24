// src/auth/jwt.strategy.ts

import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { passportJwtSecret } from 'jwks-rsa';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private configService: ConfigService) {
    const googleClientId = configService.get<string>('GOOGLE_CLIENT_ID');
    const jwtSecret = configService.get<string>('JWT_SECRET');

    if (!googleClientId && !jwtSecret) {
      throw new Error('Either GOOGLE_CLIENT_ID or JWT_SECRET must be configured');
    }

    // Si tenemos Google Client ID, usar JWKS para validar tokens de Google
    if (googleClientId) {
      super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        audience: googleClientId,
        issuer: 'https://accounts.google.com',
        algorithms: ['RS256'],
        secretOrKeyProvider: passportJwtSecret({
          jwksUri: 'https://www.googleapis.com/oauth2/v3/certs',
          cache: true,
          rateLimit: true,
        }),
      });
    } else {
      // Fallback a JWT_SECRET para desarrollo
      super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey: jwtSecret,
      });
    }

    this.logger.log('JWT Strategy initialized successfully');
  }

  async validate(payload: any) {
    this.logger.debug('JWT payload received:', JSON.stringify(payload, null, 2));
    
    return { 
      userId: payload.sub || payload.id, 
      email: payload.email,
      name: payload.name,
      accessToken: payload.accessToken,
      refreshToken: payload.refreshToken 
    };
  }
}
