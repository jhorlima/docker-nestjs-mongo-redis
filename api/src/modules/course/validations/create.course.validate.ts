import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsNotEmpty, IsString, MaxLength, ValidateNested } from 'class-validator';

export class CreateCourseValidate {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  description: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsNotEmpty({ each: true })
  tags: string[];

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested()
  @Type(() => CreateCourseUnitValidate)
  units: CreateCourseUnitValidate[];
}

export class CreateCourseUnitValidate {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested()
  @Type(() => CreateCourseUnitLessonValidate)
  lessons: CreateCourseUnitLessonValidate[];
}

export class CreateCourseUnitLessonValidate {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;
}
