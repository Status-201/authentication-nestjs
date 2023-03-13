import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Enable Cors
  app.enableCors();

  //Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('HRMS Tool')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('hrms')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', // This name here is important for matching up with @ApiBearerAuth() in your controller!
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  //Validation configuration
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
