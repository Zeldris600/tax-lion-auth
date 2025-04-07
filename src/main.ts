import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ApiConfigService } from './config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ApiConfigService);
  app.setGlobalPrefix(configService.globalPrefix);

  app.useGlobalPipes(new ValidationPipe());

  const swagger_info = configService.swaggerConfig;

  const config = new DocumentBuilder()
    .setTitle(swagger_info?.setTitle || 'API Documentation')
    .setDescription(swagger_info?.setDescription || 'API Description')
    .setVersion(swagger_info?.setVersion || '1.0')
    .addTag(swagger_info?.addTag || 'default')
    .addBearerAuth(
      {
        description: `[JWT] Please enter token in format: Bearer <JWT>`,
        name: 'Authorization',
        bearerFormat: 'Bearer',
        scheme: 'Bearer',
        type: 'http',
        in: 'Header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  const port = configService.apiPort;

  SwaggerModule.setup(`${configService.globalPrefix}/docs`, app, document);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      // forbidNonWhitelisted: true,
    }),
  );

  console.log(`
    API running on http://localhost:${port} \n
    Swagger docs available at http://localhost:${port}/${configService.globalPrefix}/docs
  `);
  await app.listen(port);
}
bootstrap();
