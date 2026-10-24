import { NestFactory } from '@nestjs/core';
import { AppModule } from '../apps/api/src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AllExceptionsFilter } from '../apps/api/src/all-exceptions.filter';
import express from 'express';

const expressApp = express();
let cachedApp: any;

async function bootstrap() {
  if (!cachedApp) {
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    );

    app.enableCors({
      origin: true,
      credentials: true,
    });

    app.useGlobalFilters(new AllExceptionsFilter());

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: false,
      }),
    );

    const config = new DocumentBuilder()
      .setTitle('The Gathering Co. API Engine')
      .setDescription('Production Event Marketplace API Engine for Anantapur & Multi-City Expansion')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);

    await app.init();
    cachedApp = app;
  }
  return expressApp;
}

export default async function handler(req: any, res: any) {
  const server = await bootstrap();
  return server(req, res);
}
