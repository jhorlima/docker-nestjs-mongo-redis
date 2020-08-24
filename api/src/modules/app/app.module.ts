import { Module } from '@nestjs/common';
import { RedisModule } from 'nestjs-redis';
import { MongooseModule } from '@nestjs/mongoose';

import redisOptions from '@/api/config/redis';
import mongoOptions from '@/api/config/mongo';

import { CourseModule } from '@/api/modules/course/course.module';
import { AppController } from '@/api/modules/app/controllers/app.controller';

@Module({
  imports: [
    RedisModule.register(redisOptions),
    MongooseModule.forRoot(mongoOptions.uri),
    CourseModule,
  ],
  controllers: [ AppController ],
  providers: [],
})
export class AppModule {
}
