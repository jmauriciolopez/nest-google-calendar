import { Module } from '@nestjs/common';
import { GoogleController } from './google.controller';
import { GoogleService } from './google.service';
import { UsersModule } from '../users/users.module'; //
import { auth } from 'googleapis/build/src/apis/abusiveexperiencereport';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [UsersModule,AuthModule], //
  controllers: [GoogleController],
  providers: [GoogleService]
})
export class GoogleModule {}
