// src/auth/jwt.strategy.ts

import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { passportJwtSecret } from 'jwks-rsa';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor( configService: ConfigService) {
   const secretOrKey = configService.get('JWT_SECRET');
    if (!secretOrKey) {
      throw new Error('JWT_SECRET is not set in the configuration');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey

    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, 
      name: payload.name, 
      email: payload.email,
      accessToken: payload.accessToken,
      refreshToken: payload.refreshToken 
    };
  }
}
