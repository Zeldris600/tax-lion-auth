import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { validate } from './config/env.validation';
import { TypeOrmModule } from '@nestjs/typeorm';
import { mmogoDbConfig } from './databases/database.typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [ ConfigModule.forRoot({
    validate,
    isGlobal: true,
    envFilePath: `${process.cwd()}/.env.${process.env.NODE_ENV}`,
  }),
  TypeOrmModule.forRootAsync(mmogoDbConfig),
  AuthModule,
  UsersModule
],
  controllers: [],
  providers: [],
})
export class AppModule {}
