import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.enableCors({
  //   origin: '*',
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  //   allowedHeaders: 'Content-Type, Accept,Authorization',
  // });
  app.enableCors({
  origin: 'http://localhost:3000', // 👈 frontend React
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'], // 👈 incluí Authorization explícitamente
});
//   app.enableCors({
//     origin: true, // permite cualquier origen
//   allowedHeaders: '*',
// });
  const config = new DocumentBuilder()
    .setTitle('Backend NestJS con Google Calendar')
    .setDescription('Documentación con Swagger')
    .setVersion('1.0')
     .addTag('authorization') // importante
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);


  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3001);
  console.log(`🚀 App running on: http://localhost:${process.env.PORT ?? 3001}`);
}
bootstrap();
