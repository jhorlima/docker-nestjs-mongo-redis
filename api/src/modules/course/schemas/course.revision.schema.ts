import { Document, Schema as MongooseSchema } from 'mongoose';
import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { CourseUnit, CourseUnitSchema } from '@/api/modules/course/schemas/course.unit.schema';

@Schema({ timestamps: true, versionKey: false })
export class CourseRevision extends Document {

  @Prop({ required: true, enum: [ 'draft', 'published' ] })
  type: string;

  @Prop({ required: true, min: 0, max: 100 })
  version: number;

  @Prop({ required: true, minlength: 1, maxlength: 100 })
  name: string;

  @Prop({ required: true, minlength: 1, maxlength: 500 })
  description: string;

  @Prop([ String ])
  tags: string[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Course' })
  course: MongooseSchema.Types.ObjectId;

  @Prop([ CourseUnitSchema ])
  units: CourseUnit[];
}

export const CourseRevisionSchema = SchemaFactory.createForClass(CourseRevision);

export const CourseRevisionModel = <ModelDefinition>{
  name: CourseRevision.name,
  schema: CourseRevisionSchema,
  collection: 'course_revision',
};
