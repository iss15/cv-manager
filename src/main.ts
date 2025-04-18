import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express'; // Import this
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';

async function bootstrap() {
  // Specify the application type as NestExpressApplication
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('CV Manager API') // Title of the API
    .setDescription('API documentation for the CV Manager project') // Description of the API
    .setVersion('1.0') // Version of the API
    .addBearerAuth() // Add support for JWT authentication in Swagger
    .build();

  // Create the Swagger document
  const document = SwaggerModule.createDocument(app, config);

  // Save the Swagger JSON file
  fs.writeFileSync('./swagger.json', JSON.stringify(document));
  
  // Setup Swagger UI at the /api/docs endpoint
  SwaggerModule.setup('api/docs', app, document);

  // Enable versioning for the API
  app.enableVersioning({
    type: VersioningType.URI, // Use URI versioning (e.g., /v1, /v2)
  });

  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:3000', // Allow requests from the React frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allowed HTTP methods
    credentials: true, // Allow cookies if needed
  });

  // Serve static files from the "public" directory
  app.useStaticAssets(join(__dirname, '..', 'public'));

  // Start the application on port 3030
  await app.listen(3030);
}
bootstrap();