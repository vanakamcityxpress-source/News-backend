// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import {
  ValidationPipe,
  HttpStatus,
  HttpException,
  ExceptionFilter,
  Catch,
  ArgumentsHost,
} from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // ✅ Enable CORS for frontend
app.enableCors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://vanakamcityxpress.com',
    'https://admin.vanakamcityxpress.com',
    'https://vsm3p0rm-5174.inc1.devtunnels.ms'
  ],
  methods: ['GET', 'POST', 'OPTIONS', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
});

  // ✅ Serve static assets (uploads folder)
const imagesPath = join(process.cwd(), 'uploads/images');
const videosPath = join(process.cwd(), 'uploads/videos');

if (!existsSync(imagesPath)) mkdirSync(imagesPath, { recursive: true });
if (!existsSync(videosPath)) mkdirSync(videosPath, { recursive: true });
// In bootstrap() function, add:
const breakingNewsPath = join(process.cwd(), 'uploads/breaking-news');
if (!existsSync(breakingNewsPath)) mkdirSync(breakingNewsPath, { recursive: true });

// Serve breaking news videos
app.useStaticAssets(breakingNewsPath, {
  prefix: '/uploads/breaking-news',
  setHeaders: (res, path) => {
    if (path.endsWith('.mp4') || path.endsWith('.mov') || path.endsWith('.avi')) {
      res.setHeader('Content-Type', 'video/mp4');
    }
  },
});
// Serve images
app.useStaticAssets(imagesPath, {
  prefix: '/uploads/images', // accessible via /uploads/images/...
});

// Serve videos
app.useStaticAssets(videosPath, {
  prefix: '/uploads/videos', // accessible via /uploads/videos/...
  setHeaders: (res, path) => {
    if (path.endsWith('.mp4')) res.setHeader('Content-Type', 'video/mp4');
  },
});

  // ✅ Global validation pipe
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
    // 👇 Allow extra multipart/form-data fields (Swagger + file upload fix)
    forbidNonWhitelisted: false,
    // 👇 Skip validation for missing optional fields
    skipMissingProperties: true,
  }),
);


  // ✅ Global exception filter
  app.useGlobalFilters(new AllExceptionsFilter());

  // ✅ Swagger setup
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Admin & Attendance API')
    .setDescription('API documentation for Admin and Attendance system')
    .setVersion('1.0')
    .setContact('Your Name', 'https://yourwebsite.com', 'your-email@example.com')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, swaggerDocument);

  const port = 3000;
  await app.listen(port);

  console.log(`🚀 Server running at: http://localhost:${port}`);
  console.log(`📘 Swagger docs:     http://localhost:${port}/api`);
  console.log(`🖼️ Uploads folder:   http://localhost:${port}/uploads`);
}

bootstrap();
