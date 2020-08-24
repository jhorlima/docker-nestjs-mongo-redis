import { Queue } from 'bull';
import { Model } from 'mongoose';
import { InjectQueue } from '@nestjs/bull';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { Course } from '@/api/modules/course/schemas/course.schema';
import { CourseRevision } from '@/api/modules/course/schemas/course.revision.schema';
import { CourseCacheService } from '@/api/modules/course/services/course.cache.service';
import { CreateCourseValidate } from '@/api/modules/course/validations/create.course.validate';

import {
  CourseException,
  CourseInternalError,
  CourseNotCreated,
  CourseNotFound,
  CourseWithoutDraft,
} from '@/api/modules/course/exceptions/course.exception';

@Injectable()
export class CourseService {
  private readonly logger = new Logger(CourseService.name);

  constructor(
    private readonly courseCacheService: CourseCacheService,
    @InjectQueue('course') private readonly courseQueue: Queue,
    @InjectModel(Course.name) private readonly courseModel: Model<Course>,
    @InjectModel(CourseRevision.name) private readonly courseRevisionModel: Model<CourseRevision>,
  ) {
  }

  protected async courseById(courseId: string, populate: string[] = []) {
    const course = await this.courseModel
      .findById(courseId)
      .populate(populate)
      .exec();

    if (!course) {
      throw new CourseNotFound('Curso não encontrado');
    }

    return course;
  }

  protected async courseByIdWithDraft(courseId: string) {
    const course = await this.courseById(courseId, [ 'draftVersion' ]);

    if (!course.draftVersion) {
      throw new CourseWithoutDraft('Curso sem rascunho');
    }

    return course;
  }

  protected async createCourseRevisionFromDraft(courseId: string, courseDraft: CreateCourseValidate) {
    return new this.courseRevisionModel({
      ...courseDraft,
      version: 0,
      type: 'draft',
      course: courseId,
    }).save();
  }

  protected async createTransactionSession() {
    const session = await this.courseModel.db.startSession();
    session.startTransaction();
    return session;
  }

  @Cron(CronExpression.EVERY_MINUTE, {
    name: 'courses',
  })
  async updateCoursesCache() {
    const courses = await this.courseModel
      .find()
      .populate([ 'draftVersion', 'lastVersion' ])
      .exec();

    if (courses.length) {
      await this.courseQueue.add('create_courses_cache', courses);
      this.logger.log(`Courses cache updated at ${ Date.now() }`);
    }
  }

  async findAll() {
    return this.courseCacheService.getCoursesCache();
  }

  async findById(courseId: string) {
    try {
      const courseFromCache = await this.courseCacheService.getCourseCache(courseId);

      if (courseFromCache !== null) {
        return courseFromCache;
      }

      const course = await this.courseById(courseId, [ 'draftVersion', 'lastVersion' ]);

      await this.courseQueue.add('create_course_cache', course);

      return course;
    } catch (error) {
      if (error instanceof CourseException) {
        throw error;
      }
      throw new CourseInternalError(error);
    }
  }

  async create(courseDraft: CreateCourseValidate) {
    let session;

    try {

      session = await this.createTransactionSession();

      const course = new this.courseModel({
        status: 'draft',
      });

      const courseRevision = await this.createCourseRevisionFromDraft(course.id, courseDraft);
      course.draftVersion = courseRevision.id;
      await course.save();

      await session.commitTransaction();

      return course.id;

    } catch (error) {
      throw new CourseNotCreated(error);
    } finally {
      session?.endSession();
    }
  }

  async updateDraft(courseId: string, courseDraft: CreateCourseValidate) {
    let session;

    try {

      session = await this.createTransactionSession();

      const course = await this.courseById(courseId, [ 'draftVersion' ]);

      if (!course.draftVersion) {
        const draftVersion = await this.createCourseRevisionFromDraft(course.id, courseDraft);
        course.draftVersion = draftVersion.id;
        await course.save();
      }
      else {
        const draftVersion = course.draftVersion as CourseRevision;
        await draftVersion.update(courseDraft);
      }

      await session.commitTransaction();

      await this.courseQueue.add('create_course_cache', course);

      return course.id;

    } catch (error) {
      if (error instanceof CourseException) {
        throw error;
      }
      throw new CourseInternalError(error);
    } finally {
      session?.endSession();
    }
  }

  async publishDraft(courseId: string) {
    let session;

    try {
      session = await this.createTransactionSession();

      const course = await this.courseByIdWithDraft(courseId);

      const draftVersion = course.draftVersion as CourseRevision;

      draftVersion.version++;
      course.draftVersion = undefined;
      course.lastVersion = draftVersion.id;
      course.versions.push(draftVersion.id);
      course.status = draftVersion.type = 'published';

      await course.save();
      await draftVersion.save();

      await session.commitTransaction();

      await this.courseQueue.add('create_course_cache', course);

      return course.id;

    } catch (error) {
      if (error instanceof CourseException) {
        throw error;
      }
      throw new CourseInternalError(error);
    } finally {
      session?.endSession();
    }
  }

  async deleteDraft(courseId: string) {
    let session;

    try {
      session = await this.createTransactionSession();

      const course = await this.courseByIdWithDraft(courseId);

      const draftVersion = course.draftVersion as CourseRevision;

      course.draftVersion = undefined;

      await course.save();
      await draftVersion.deleteOne();

      await session.commitTransaction();

      await this.courseQueue.add('delete_course_cache', course);

      return course.id;

    } catch (error) {
      if (error instanceof CourseException) {
        throw error;
      }
      throw new CourseInternalError(error);
    } finally {
      session?.endSession();
    }
  }
}
