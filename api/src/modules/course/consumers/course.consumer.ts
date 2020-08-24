import { Job } from 'bull';
import { Process, Processor } from '@nestjs/bull';

import { Course } from '@/api/modules/course/schemas/course.schema';
import { CourseCacheService } from '@/api/modules/course/services/course.cache.service';

@Processor('course')
export class CourseConsumer {

  constructor(private readonly courseCacheService: CourseCacheService) {
  }

  @Process('create_course_cache')
  async createCourseCache(job: Job<Course>) {
    const course = job.data;
    await this.courseCacheService.createCoursesCache([ course ]);
    return {
      id: course._id,
    };
  }

  @Process('create_courses_cache')
  async createCoursesCache(job: Job<Course[]>) {
    const courses = job.data;
    await this.courseCacheService.createCoursesCache(courses);
    return courses.map(course => ( { id: course._id } ));
  }

  @Process('delete_course_cache')
  async deleteCourseCache(job: Job<Course>) {
    const course = job.data;
    await this.courseCacheService.deleteCourseCache(course);
    return {
      id: course._id,
    };
  }
}
