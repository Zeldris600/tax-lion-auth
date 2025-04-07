import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    description: 'The phone number of the user.',
    example: '+1234567890',
  })
  @IsString()
  @IsNotEmpty()
  @IsString()
  phone: string;

  @ApiProperty({
    description: 'The password for the user.',
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
