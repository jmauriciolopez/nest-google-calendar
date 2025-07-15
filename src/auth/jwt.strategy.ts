// src/auth/jwt.strategy.ts

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { passportJwtSecret } from 'jwks-rsa';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
       audience: '409827581778-i2d2ffkmrj2qlh3pnunlf5u5snc1c4g2.apps.googleusercontent.com',
      issuer: 'https://accounts.google.com',
      algorithms: ['RS256'],
      secretOrKeyProvider: passportJwtSecret({
        jwksUri: 'https://www.googleapis.com/oauth2/v3/certs',
      }),
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, 
      email: payload.email,
      accessToken: payload.accessToken,
      refreshToken: payload.refreshToken };
  }
}
