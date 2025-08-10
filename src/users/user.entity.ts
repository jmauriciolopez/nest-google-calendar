// src/users/user.entity.ts

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  firstName: string;
   @Column()
  lastName: string;

  @Column({ select: false }) // 👈 oculta el password por defecto en consultas
  password: string;
}

