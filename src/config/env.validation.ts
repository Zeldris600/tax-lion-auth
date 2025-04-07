import { plainToClass } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsString, validateSync } from 'class-validator';

enum EnvironmentType {
  DEV = 'DEV',
  PROD = 'PROD',
  STAGING = 'STAGING',
}

class EnvironmentVariables {
  @IsEnum(EnvironmentType)
  NODE_ENV: string;

  @IsNumber()
  APP_PORT: number;

  @IsString()
  APP_PREFIX: string;

  @IsString()
  CLIENT_URL: string;

  @IsString()
  DATABASE_HOST: string;

  @IsString()
  DATABASE_USER: string;

  @IsString()
  DATABASE_PASSWORD: string;

  @IsString()
  DATABASE_NAME: string;

  @IsNumber()
  DATABASE_PORT: number;

  @IsString()
  JWT_SECRET: string;

  @IsNumber()
  JWT_EXPIRE_TIME: number;

  @IsString()
  JWT_REFRESH_TOKEN_SECRET: string;

  @IsString()
  MAILER_HOST: string;

  @IsString()
  MAILER_USER: string;

  @IsString()
  MAILER_FROM: string;

  @IsNumber()
  MAILER_PORT: number;

  @IsString()
  MAILER_PASSWORD: string;

  @IsNumber()
  JWT_REFRESH_EXPIRE_TIME: number;

  @IsString()
  SM_SWAGGER_TITLE: string;

  @IsString()
  SM_SWAGGER_DESCRIPTION: string;

  @IsNumber()
  SM_SWAGGER_Version: number;

  @IsString()
  SM_SWAGGER_TAG: string;

}

export function validate(configuration: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, configuration, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });
  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
