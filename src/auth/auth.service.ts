// src/auth/auth.service.ts

import { ConflictException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

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
}