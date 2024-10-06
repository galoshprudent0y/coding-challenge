import { NestFactory } from '@nestjs/core';
import { SwaggerModule, OpenAPIObject } from '@nestjs/swagger';
import { AppModule } from './App.module';
import { GlobalZodValidationPipe } from './shared/pipes/GlobalZodValidationPipe';
import { GlobalExceptionFilter } from './shared/middleware/error-handling.middleware';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { INestApplication } from '@nestjs/common';
import * as path from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Set up global Zod validation pipe
  app.useGlobalPipes(new GlobalZodValidationPipe());

  // Set up global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  // Set up Swagger using OpenAPI spec file
  setupSwagger(app);

  // Start the server on port 3000
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

function setupSwagger(app: INestApplication) {
  try {
    const openApiPath = path.join(process.cwd(), 'openapi-spec.yaml');
    const openApiYaml = fs.readFileSync(openApiPath, 'utf8');
    const openApiDocument = yaml.load(openApiYaml);

    if (isOpenAPIObject(openApiDocument)) {
      SwaggerModule.setup('api', app, openApiDocument);
      console.log('Swagger UI set up successfully at /api');
    } else {
      console.error('Invalid OpenAPI specification');
    }
  } catch (error) {
    console.error('Failed to set up Swagger:', error);
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      console.error(
        'openapi-spec.yaml file not found. Please ensure the file exists in the project root.',
      );
    }
  }
}

function isOpenAPIObject(obj: any): obj is OpenAPIObject {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'openapi' in obj &&
    'info' in obj &&
    'paths' in obj
  );
}

bootstrap();
