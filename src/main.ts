import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(cors());
  app.enableCors();
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    index: ['index.html'],
  });
  await app.listen(3001);
  console.log('Stock Trade API running on http://localhost:3001');
  console.log('Open UI: http://localhost:3001/');
}
bootstrap();
