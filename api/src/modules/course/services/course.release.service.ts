import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { CourseRelease } from '@/api/modules/course/schemas/course.release.schema';
import { CourseReleaseProgress } from '@/api/modules/course/schemas/course.release.progress.schema';

@Injectable()
export class CourseReleaseService {
  constructor(
    @InjectModel(CourseRelease.name) private readonly courseReleaseModel: Model<CourseRelease>,
    @InjectModel(CourseReleaseProgress.name) private readonly courseReleaseProgressModel: Model<CourseReleaseProgress>,
  ) {
  }
}
