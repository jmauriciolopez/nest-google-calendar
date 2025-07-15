import { Module } from '@nestjs/common';
import { GoogleController } from './google.controller';
import { GoogleService } from './google.service';
import { UsersModule } from '../users/users.module'; //

@Module({
  imports: [UsersModule], //
  controllers: [GoogleController],
  providers: [GoogleService]
})
export class GoogleModule {}
