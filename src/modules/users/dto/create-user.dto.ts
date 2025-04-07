
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'The user\'s name', required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'The user\'s phone number', required:true })
  @IsString()
  phone: string;


  @ApiProperty({ description: 'The user\'s password' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
