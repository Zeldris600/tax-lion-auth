import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@ApiTags('auth') 
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'The user has been successfully registered.', type: User })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiBody({type: CreateUserDto})
  @Post()
  create(@Body() payload: CreateUserDto) {
    return this.authService.register(payload);
  }

  @ApiOperation({ summary: 'Log in a user' })
  @ApiResponse({ status: 200, description: 'The user has been successfully logged in.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiBody({type: LoginDto})
  @UseGuards(AuthGuard('phone'))
  @Post('login')
  login(@Request() req) {
    return this.authService.login(req.user);
  }

  @ApiOperation({ summary: 'Verify OTP' })
  @ApiResponse({ status: 200, description: 'OTP successfully verified' })
  @ApiResponse({ status: 401, description: 'Invalid or expired OTP' })
  @ApiBody({type: VerifyOtpDto})
  @Post('verify-otp')   
  verifyOtp(@Body()payload: VerifyOtpDto) {
    return this.authService.verifyOtp(payload);
  }
}
