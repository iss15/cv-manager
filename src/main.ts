import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express'; // Import this

async function bootstrap() {
  // Specify the application type as NestExpressApplication
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // Serve static files from the "public" directory
  app.useStaticAssets(join(__dirname, '..', 'public'));

  await app.listen(3030);
}
bootstrap();