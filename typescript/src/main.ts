import { ValidationPipe } from "@nestjs/common";
import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { GlobalExceptionsFilter } from "./exception.filter";
import { GlobalInterceptor } from "./interceptor";
import { AppModule } from "./module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ["error", "warn", "log", "debug", "verbose"],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  app.useGlobalInterceptors(new GlobalInterceptor());

  app.useGlobalFilters(new GlobalExceptionsFilter(app.get(HttpAdapterHost)));

  await app.listen(3000);
}

bootstrap();
