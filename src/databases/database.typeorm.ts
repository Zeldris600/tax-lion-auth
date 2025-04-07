import { MailerAsyncOptions } from '@nestjs-modules/mailer/dist/interfaces/mailer-async-options.interface';
import { JwtModuleAsyncOptions } from '@nestjs/jwt';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ApiConfigService } from 'src/config/config.service';
import * as path from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

export const mmogoDbConfig: TypeOrmModuleAsyncOptions = {
  useFactory: async (configService: ApiConfigService) => ({
    type: 'mongodb',
    url: configService.mongoDdCreds.uri,
    database: configService.mongoDdCreds.database,
    ssl: true,
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: process.env.NODE_ENV !== 'production', 
    logging: process.env.NODE_ENV === 'development', 
  }),
  inject: [ApiConfigService],
  extraProviders: [ApiConfigService],
}


export const jwtConfiguration: JwtModuleAsyncOptions = {
  useFactory: async (configService: ApiConfigService) => ({
    secret: configService.jwtConfig.jwt_secret,
    signOptions: {
      expiresIn: configService.jwtConfig.jw_expiration,
    },
  }),
  inject: [ApiConfigService],
  extraProviders: [ApiConfigService],
};

export const MailerConfiguration: MailerAsyncOptions = {
  useFactory: async (configService: ApiConfigService) => ({
    transport: configService.mailerConfig,
    template: {
       dir: path.resolve(__dirname, process.env.NODE_ENV === 'production' ? '../../dist/modules/templates' : '../../src/modules/templates'),
      adapter: new HandlebarsAdapter(),
      options: {
        strict: true,
      },
    },
  }),
  inject: [ApiConfigService],
  extraProviders: [ApiConfigService],
};

