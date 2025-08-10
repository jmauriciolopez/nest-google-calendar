// src/negocio/negocio.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Negocio {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  phone: string;

  @OneToOne(() => User, { cascade: true })
  @JoinColumn()
  user: User;
}