// src/negocio/negocio.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NegocioController } from './negocio.controller';
import { NegocioService } from './negocio.service';
import { Negocio } from './negocio.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Negocio]), UsersModule],
  controllers: [NegocioController],
  providers: [NegocioService],
})
export class NegocioModule {}