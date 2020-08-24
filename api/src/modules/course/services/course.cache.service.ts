import { Redis } from 'ioredis';
import { Injectable } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';

import { Course } from '@/api/modules/course/schemas/course.schema';

@Injectable()
export class CourseCacheService {
  protected redis: Redis;

  constructor(redisService: RedisService) {
    this.redis = redisService.getClient();
  }

  async createCoursesCache(courses: Course[]): Promise<Course[]> {
    const coursesCache = courses.reduce((acc, course) => {
      acc[course._id] = JSON.stringify(course);
      return acc;
    }, {});
    await this.redis.hmset('courses', coursesCache);
    return courses;
  }

  async getCourseCache(courseId: string): Promise<Course|null> {
    const [ course ] = await this.redis.hmget('courses', courseId);
    return course ? JSON.parse(course) : null;
  }

  async getCoursesCache(): Promise<Course[]> {
    const courses = await this.redis.hgetall('courses');
    return Object.values(courses).map(course => JSON.parse(course));
  }

  async deleteCourseCache(course: Course): Promise<Course> {
    await this.redis.hdel('courses', course._id);
    return course;
  }
}
