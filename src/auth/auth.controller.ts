import { BadRequestException, Body, Controller, Post, UnauthorizedException, Request, Get, UseGuards, Req, Res, HttpStatus } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
//import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { GoogleOAuthGuard } from './google-oauth.guard';
import { Response } from 'express';
import { targetModulesByContainer } from '@nestjs/core/router/router-module';
import { JwtAuthGuard } from './jwt-auth.guard';
//import { AuthGuard } from '@nestjs/passport';
@ApiTags('authorization')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
    private configService: ConfigService,
  ) { }

  @Get()
  @UseGuards(GoogleOAuthGuard)
  async googleAuth(@Req() req: Request) {
    // Inicia el flujo de autenticación con Google
  }
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req) {
 //  console.log('Profile request:', req.user);
    return req.user; // viene del validate() en JwtStrategy
  }
  @Get('google/callback')
  @UseGuards(GoogleOAuthGuard)
  googleAuthRedirect(@Request() req, @Res() res: Response) {
    const data = this.authService.googleLogin(req);
    const token = this.authService.generateJwt(data.user);
    const frontendUrl = new URL(this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000');
   // frontendUrl.searchParams.append('email', data.user.email);
   // frontendUrl.searchParams.append('name', data.user.firstName + ' ' + data.user.lastName);
    frontendUrl.searchParams.append('token', token); // si usás JWT
   // console.log(data.user);

    return res.redirect(frontendUrl.toString());
  }
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
