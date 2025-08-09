// src/auth/jwt-auth.guard.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  //   handleRequest(err, user, info, context) {
  //   if (err || !user) {
  //     console.error('Error in JWT Auth Guard:', err, info);
  //     throw err || new UnauthorizedException('Token inválido o no enviado');
  //   }
  //   return user;
  // }


// @Injectable()
// export class JwtAuthGuard extends PassportStrategy(Strategy) {
  // constructor() {
  //   if (!process.env.JWT_SECRET) {
  //     throw new Error('JWT_SECRET environment variable is not defined');
  //   }
  //   super({
  //     jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  //     ignoreExpiration: false,
  //     secretOrKey: process.env.JWT_SECRET, // Asegúrate de que esté definido
  //   });
  // }

  async validate(payload: any) {
    console.log('Validating JWT payload:', payload);
    return { id: payload.sub, email: payload.email ,name: payload.name};
  }
 }
