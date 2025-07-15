import { BadRequestException, Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from  './dto/login.dto';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';

@ApiTags('authorization')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
async login(@Body() loginDto: LoginDto) {
  const user = await this.authService.validateUser(
    loginDto.email,
    loginDto.password,
  );

  if (!user) {
    throw new UnauthorizedException('Invalid credentials');
  }

  return this.authService.login(user);
}

 @Post('google')
  loginWithGoogle(@Body('token') token: string) {
    return this.authService.logingoogle(token);
  }

  @Post('register')
async register(@Body() registerDto: RegisterDto) {
  if (registerDto.password !== registerDto.confirmPassword) {
    throw new BadRequestException('Las contraseñas no coinciden');
  }

  return this.authService.register(registerDto);
}

}
