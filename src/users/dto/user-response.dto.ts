import { Exclude } from 'class-transformer';
export class UserResponseDto {
  id: number;
  email: string;
  lastName?: string;
  firstName?: string;
  middlename?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}