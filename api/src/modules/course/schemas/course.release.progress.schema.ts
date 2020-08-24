import { Document, Schema as MongooseSchema } from 'mongoose';
import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { CourseRelease } from '@/api/modules/course/schemas/course.release.schema';

@Schema()
export class CourseReleaseProgress extends Document {

  @Prop({ minlength: 1 })
  user: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'CourseRelease' })
  release: MongooseSchema.Types.ObjectId|CourseRelease;

  @Prop()
  progress: Map<string, number>;
}

export const CourseReleaseProgressSchema = SchemaFactory.createForClass(CourseReleaseProgress);

export const CourseReleaseProgressModel = <ModelDefinition>{
  name: CourseReleaseProgress.name,
  schema: CourseReleaseProgressSchema,
  collection: 'course_release_progress',
}
