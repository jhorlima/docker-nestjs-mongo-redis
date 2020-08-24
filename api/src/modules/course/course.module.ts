import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';

import redisOptions from '@/api/config/redis';

import { CourseConsumer } from '@/api/modules/course/consumers/course.consumer';

import { CourseService } from '@/api/modules/course/services/course.service';
import { CourseController } from '@/api/modules/course/controllers/course.controller';
import { CourseCacheService } from '@/api/modules/course/services/course.cache.service';

import { CourseModel } from '@/api/modules/course/schemas/course.schema';
import { CourseUnitModel } from '@/api/modules/course/schemas/course.unit.schema';
import { CourseResumeModel } from '@/api/modules/course/schemas/course.resume.schema';
import { CourseLessonModel } from '@/api/modules/course/schemas/course.lesson.schema';
import { CourseReleaseModel } from '@/api/modules/course/schemas/course.release.schema';
import { CourseRevisionModel } from '@/api/modules/course/schemas/course.revision.schema';
import { CourseLessonAttemptModel } from '@/api/modules/course/schemas/course.lesson.attempt.schema';
import { CourseReleaseProgressModel } from '@/api/modules/course/schemas/course.release.progress.schema';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    BullModule.registerQueue({
      name: 'course',
      redis: {
        ...redisOptions,
        db: null,
      },
    }),
    MongooseModule.forFeature([
      CourseModel,
      CourseUnitModel,
      CourseLessonModel,
      CourseResumeModel,
      CourseReleaseModel,
      CourseRevisionModel,
      CourseLessonAttemptModel,
      CourseReleaseProgressModel,
    ]),
  ],
  controllers: [ CourseController ],
  providers: [ CourseService, CourseCacheService, CourseConsumer ],
})
export class CourseModule {
}
