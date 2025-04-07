// src/auth/dto/verify-otp.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyOtpDto {
@ApiProperty({
        example: '+14155552671',
        description: 'Phone number associated with the user',
        required: true
      })
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({
    example: '123456',
    description: 'OTP code sent to the user',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  code: string;
}
