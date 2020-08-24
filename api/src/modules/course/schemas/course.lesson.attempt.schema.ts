import { Document, Schema as MongooseSchema } from 'mongoose';
import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { CourseRelease } from '@/api/modules/course/schemas/course.release.schema';

@Schema({ timestamps: true })
export class CourseLessonAttempt extends Document {

  @Prop({ minlength: 1 })
  user: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'CourseRelease' })
  release: MongooseSchema.Types.ObjectId|CourseRelease;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'CourseLesson' })
  lesson: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  sendAt: Date;

  @Prop()
  answers: string[];
}

export const CourseLessonAttemptSchema = SchemaFactory.createForClass(CourseLessonAttempt);

export const CourseLessonAttemptModel = <ModelDefinition>{
  name: CourseLessonAttempt.name,
  schema: CourseLessonAttemptSchema,
  collection: 'course_lesson_attempt',
};
