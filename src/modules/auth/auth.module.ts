import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConfiguration } from 'src/databases/database.typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Otp } from './entities/otp.entity';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { OtpService } from './otp.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { PhoneStrategy } from './strategy/phone.strategy';
import { ApiConfigService } from 'src/config/config.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Otp]),
    UsersModule,
    PassportModule,
    JwtModule.registerAsync(jwtConfiguration),

  ],
  controllers: [AuthController],
  providers: [AuthService, OtpService, JwtStrategy, PhoneStrategy, ApiConfigService],
})
export class AuthModule {}
