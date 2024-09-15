import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as express from 'express';
import {join} from 'path'
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';
import { TransformInterceptor } from './config/TransformInterceptor';
import * as cookieParser from 'cookie-parser';
import { Reflector } from '@nestjs/core';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('9dee9c0c-d2e5-44c0-891a-1e446bece049');
  // app.useGlobalGuards(new JwtAuthGuard());
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new TransformInterceptor(reflector));
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Automatically strip out any properties not defined in the DTO
    forbidNonWhitelisted: true, // Throw an error if any non-whitelisted properties are provided
    transform: true, // Automatically transform payloads to be objects typed according to their DTO classes
  }));
  app.use(cookieParser());
  const isDev = process.env.STAGE === 'dev'
  console.log('isDevv',isDev)
  app.use('/files', express.static(join(__dirname,isDev ? '' : '..','..', 'files')))
  app.use('/uploads', express.static(join(__dirname, isDev ? '' : '..', '..', 'uploads')));
  app.use('/images', express.static(join(__dirname, isDev ? '' : '..','..', 'images')))
  app.use('/media', express.static(join(__dirname, isDev ? '' : '..','..', 'media')))
  app.use(express.json({limit: '50mb'}));
  app.use(express.urlencoded({limit: '50mb'}));
  app.use((req, res, next) => {
    res.removeHeader('X-Powered-By');
    next();
  });
  
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
