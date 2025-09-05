import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './config/swagger.config';
import { ResponseInterceptor } from './shared/interceptors/response.interceptor';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://192.168.137.101:3001',
  ];

  app.use(cookieParser());

  app.enableCors({
    origin: (origin, callback) => {
      // Permite peticiones sin "origin" (ej: curl, apps nativas)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error(`CORS bloqueado para origin: ${origin}`), false);
      }
    },
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Cache-Control',
      'x-csrf-token',
      'X-CSRF-Token',
    ],
    exposedHeaders: ['Content-Length', 'Content-Range', 'Set-Cookie'],
    credentials: true,
    maxAge: 600,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  app.useGlobalInterceptors(new ResponseInterceptor());

  setupSwagger(app);

  await app.listen(3000);
}
bootstrap();
