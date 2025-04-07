import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { OtpService } from './otp.service';
import { User } from '../users/entities/user.entity';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly otpService: OtpService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(phone: string, password: string): Promise<User | null> {
    const user = await this.usersService.findByPhone(phone);
    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch ? user : null;
  }

  async login(user: User) {
    const payload = { sub: user.id, phone: user.phone };
    const access_token = this.jwtService.sign(payload);

    return {
      access_token,
      user: {
        id: user.id,
        phone: user.phone,
        name: user.name,
      },
    };
  }

  // async register(dto: CreateUserDto) {
  //   const { password, phone, name } = dto;
    
  //   const existing = await this.usersService.findByPhone(phone);
  //   if (existing) {
  //     throw new BadRequestException('Phone number already registered');
  //   }

  //   const hashedPassword = await bcrypt.hash(password, 10);
    
  //   const user = await this.usersService.create({ phone, password: hashedPassword, name });
  //   return this.login(user); 
  // }
  async register(dto: CreateUserDto) {
    try {
      const { password, phone, name } = dto;

    const existing = await this.usersService.findByPhone(phone);
    if (existing) {
      throw new BadRequestException('Phone number already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await this.usersService.create({ phone, password: hashedPassword, name });
    await this.otpService.generateOtp(phone);

    return { message: 'OTP sent, please verify your phone' };
    } catch (error) {
      throw error;
    }
  }

  async sendOtp(phone: string) {
    const user = await this.usersService.findByPhone(phone);
    if (!user) throw new UnauthorizedException('User not found');

    await this.otpService.generateOtp(phone);

    return { message: 'OTP sent via WhatsApp' };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const {phone, code} = dto
    const user = await this.usersService.findByPhone(phone);
    if (!user) throw new UnauthorizedException('User not found');

    const isValid = await this.otpService.verifyOtp(phone, code);
    if (!isValid) throw new UnauthorizedException('Invalid or expired OTP');

    user.isPhoneVerified = true;
    await this.usersService.update(user.id, {...user});

    return this.login(user);
  }
}
