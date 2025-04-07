import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import dotenv = require('dotenv');
dotenv.config({
  path: `.env`,
});

//why's process.env not available here?
// require('dotenv').config({
//   path: `${process.cwd()}/.env.${process.env.NODE_ENV}`,
// });

@Injectable()
export class ApiConfigService {
  constructor(private configService: ConfigService) {}

  get apiPort() {
    const port = this.configService.get('APP_PORT');
    return port;
  }

  get globalPrefix() {
    return this.configService.get('APP_PREFIX');
  }

  get clientUrl() {
    return this.configService.get('CLIENT_URL');
  }

  get apiPrefix() {
    return this.configService.get('APP_PREFIX');
  }

  get mongoDdCreds() {
    const creds = {
      uri: this.configService.get('MONGOBD_URI'),
      host: this.configService.get('DATABASE_HOST'),
      port: this.configService.get('DATABASE_PORT'),
      user: this.configService.get('DATABASE_USER'),
      password: this.configService.get('DATABASE_PASSWORD'),
      database: this.configService.get('DATABASE_NAME'),
    };
    return creds;
  }

  get jwtConfig() {
    const keys = {
      jwt_secret: this.configService.get('JWT_SECRET'),
      jw_expiration: this.configService.get('JWT_EXPIRE_TIME'),
      jwt_refresh_secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      jwt_resfreh_expiration: this.configService.get('JWT_REFRESH_EXPIRE_TIME'),
    };

    return keys;
  }

  get vonageCreds(){
    return {
      apiKey: this.configService.get('VONAGE_API_KEY'),
      secrete: this.configService.get('VONAGE_API_SECRET'),
      whatsappNumber: this.configService.get('VONAGE_WHATSAPP_NUMBER')
    }
  }

  get mailerConfig() {
    const emailConfig = {
      host: this.configService.get('MAILER_HOST'),
      port: this.configService.get('MAILER_PORT'),
      // port:465,
      auth: {
        user: this.configService.get('MAILER_USER'),
        pass: this.configService.get('MAILER_PASSWORD'),
      },
      from: this.configService.get('MAILER_FROM'),
      secure: true
    };

    return emailConfig;
  }

  get swaggerConfig() {
    return {
      setTitle: this.configService.get('SM_SWAGGER_TITLE'),
      setDescription: this.configService.get('SM_SWAGGER_DESCRIPTION'),
      setVersion: this.configService.get('SM_SWAGGER_Version'),
      addTag: this.configService.get('SM_SWAGGER_TAG'),
    };
  }

}
