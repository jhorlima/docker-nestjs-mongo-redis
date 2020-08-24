import { Document } from 'mongoose';
import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { CourseLesson, CourseLessonSchema } from '@/api/modules/course/schemas/course.lesson.schema';

@Schema()
export class CourseUnit extends Document {
  @Prop({ required: true })
  title: string;

  @Prop([ CourseLessonSchema ])
  lessons: CourseLesson[];
}

export const CourseUnitSchema = SchemaFactory.createForClass(CourseUnit);

export const CourseUnitModel = <ModelDefinition>{
  name: CourseUnit.name,
  schema: CourseUnitSchema,
}
