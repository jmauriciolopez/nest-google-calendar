import { BadRequestException, Body, Controller, Post, UnauthorizedException , Get, UseGuards, Req, Res, HttpStatus} from '@nestjs/common';
import { LoginDto } from  './dto/login.dto';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config'; 
import { Request, Response } from 'express';
@ApiTags('authorization')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService,
      private configService: ConfigService,
    ) {}

     @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req: Request) {
    // Inicia el flujo de autenticación con Google
  }

  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    try {
      const result = await this.authService.googleLogin(req);
      
      // Redirigir al frontend con el token
      const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';
      
      res.redirect(`${frontendUrl}/auth/callback?token=${result.access_token}`);
    } catch (error) {
      console.error('Google auth callback error:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Error durante la autenticación con Google',
      });
    }
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
