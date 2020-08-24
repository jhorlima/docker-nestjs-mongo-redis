import { Document, Schema as MongooseSchema } from 'mongoose';
import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { CourseLesson } from '@/api/modules/course/schemas/course.lesson.schema';

@Schema()
export class CourseResume extends Document {
  @Prop({ required: true, minlength: 1 })
  name: string;

  @Prop({ required: true, min: 1 })
  version: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'CourseLesson' })
  lessons_ids: MongooseSchema.Types.ObjectId [];
}

export const CourseResumeSchema = SchemaFactory.createForClass(CourseResume);

export const CourseResumeModel = <ModelDefinition>{
  name: CourseResume.name,
  schema: CourseResumeSchema,
}
