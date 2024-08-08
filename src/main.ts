import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as express from 'express';
import {join} from 'path'
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('9dee9c0c-d2e5-44c0-891a-1e446bece049');
  app.useGlobalGuards(new JwtAuthGuard());
  app.use('/files', express.static(join(__dirname,'..','..', 'files')))
  app.use('/uploads', express.static(join(__dirname, '..', '..', 'uploads')));
  app.use('/images', express.static(join(__dirname, '..','..', 'images')))
  app.use('/media', express.static(join(__dirname, '..','..', 'media')))
  app.use(express.json({limit: '50mb'}));
  app.use(express.urlencoded({limit: '50mb'}));
  
  const config = new DocumentBuilder()
  .setTitle('Cherry API')
  .setDescription('Cherry API')
  .setVersion('1.0')
  .addTag('api')
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  const port = process.env.PORT;
  await app.listen(port);

  logger.log(`Application listening on port ${port}`)
}
bootstrap();
