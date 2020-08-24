import { Document } from 'mongoose';
import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true, versionKey: false })
export class CourseLesson extends Document {
  @Prop({ required: true })
  title: string;
}

export const CourseLessonSchema = SchemaFactory.createForClass(CourseLesson);

export const CourseLessonModel = <ModelDefinition>{
  name: CourseLesson.name,
  schema: CourseLessonSchema,
}
