import { Document } from 'mongoose';
import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { CourseResume, CourseResumeSchema } from '@/api/modules/course/schemas/course.resume.schema';

@Schema()
export class CourseRelease extends Document {
  @Prop({ required: true, min: 1 })
  company: number;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop(CourseResumeSchema)
  course: CourseResume;

  @Prop()
  users: string[];
}

export const CourseReleaseSchema = SchemaFactory.createForClass(CourseRelease);

export const CourseReleaseModel = <ModelDefinition>{
  name: CourseRelease.name,
  schema: CourseReleaseSchema,
  collection: 'course_release',
};
