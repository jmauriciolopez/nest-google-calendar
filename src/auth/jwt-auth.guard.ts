// src/auth/jwt-auth.guard.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    handleRequest(err, user, info, context) {
    if (err || !user) {
      throw err || new UnauthorizedException('Token inválido o no enviado');
    }
    return user;
  }
}
