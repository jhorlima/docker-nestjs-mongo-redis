import { Document, Schema as MongooseSchema } from 'mongoose';
import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { CourseRevision } from '@/api/modules/course/schemas/course.revision.schema';

@Schema({ timestamps: true, versionKey: false })
export class Course extends Document {
  @Prop({ required: true, enum: [ 'draft', 'published' ] })
  status: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'CourseRevision' })
  lastVersion?: MongooseSchema.Types.ObjectId|CourseRevision;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'CourseRevision' })
  draftVersion?: MongooseSchema.Types.ObjectId|CourseRevision;

  @Prop([ { type: MongooseSchema.Types.ObjectId, ref: 'CourseRevision' } ])
  versions: MongooseSchema.Types.ObjectId[]|CourseRevision[];
}

export const CourseSchema = SchemaFactory.createForClass(Course);

export const CourseModel = <ModelDefinition>{
  name: Course.name,
  schema: CourseSchema,
}
