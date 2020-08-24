import { NestFactory } from '@nestjs/core';

import { AppModule } from '@/api/modules/app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.SERVER_PORT, '0.0.0.0');
}

bootstrap();
