import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vonage } from '@vonage/server-sdk';
import { Channels } from '@vonage/messages'
import { Otp } from './entities/otp.entity';
import { ApiConfigService } from 'src/config/config.service';
import { UsersService } from '../users/users.service';
import * as crypto from 'crypto';
import { Auth } from '@vonage/auth';
import axios from 'axios';



@Injectable()
export class OtpService {
  private vonage;

  constructor(
    private configService: ApiConfigService,
    @InjectRepository(Otp)
    private otpRepo: Repository<Otp>,
    private readonly usersService: UsersService,
  ) {
    this.vonage = new Vonage(new Auth({
      apiKey: this.configService.vonageCreds.apiKey,
      apiSecret: this.configService.vonageCreds.secrete,
      // applicationId: `035d6891-2102-405d-bc6a-37d1608b8523`,
      // privateKey: fs.readFileSync(path.resolve(__dirname + "../../../../src/config/private.key"))
    }));

  }

  async generateOtp(phone: string) {
   try {
    const user = await this.usersService.findByPhone(phone);
    if (!user) {
      throw new Error('User not found');
    }

    const otp = this.generateRandomOtp();
    const expiresAt = Date.now() + 5 * 60 * 1000;

    const otpEntity = this.otpRepo.create({
      user,
      code: otp,
      expiresAt,
      phone
    });

   await this.otpRepo.save(otpEntity);    

    await this.sendOtp(phone, otp);
   } catch (error) {
    throw error;
   }
  }

  async sendOtp(phone: string, code: string) {
    try {

      const message = {
        to: phone,
        from: this.configService.vonageCreds.whatsappNumber,
        text: `Your OTP is ${code}`,
        channel: Channels.WHATSAPP,
        message_type: 'text',
      };

      // Send the message via Vonage API
      // this.vonage.messages.send(message)
      //   .then((resp) => console.log(resp.messageUUID))
      //   .catch((error) => console.error(error));



      // Send the message via Vonage API using Axios
      await axios.post(
        'https://messages-sandbox.nexmo.com/v1/messages',
        message,
        {
          auth: {
            username: this.configService.vonageCreds.apiKey,
            password: this.configService.vonageCreds.secrete,
          },
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
        },
      );


    } catch (error) {
      console.error('Error sending OTP:', error);
      throw new InternalServerErrorException(`${error?.message}`);
    }
  }

  generateRandomOtp() {
    return crypto.randomInt(100000, 999999).toString();
  }

  async verifyOtp(phone: string, code: string): Promise<boolean> {
  try {
    const latestOtp = await this.otpRepo.findOne({
      where: { phone },
      order: { createdAt: 'DESC' },
    });


    if (
      !latestOtp ||
      latestOtp.code !== code ||
      Date.now() > latestOtp.expiresAt ||
      latestOtp.verified
    ) {
      throw new UnauthorizedException('Invalid or expired OTP');
    }

    latestOtp.verified = true;
    await this.otpRepo.save(latestOtp);

    return true;
  } catch (error) {
    throw error;
  }
  }
}
