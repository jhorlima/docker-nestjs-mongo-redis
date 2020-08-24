import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';

import { CourseService } from '@/api/modules/course/services/course.service';
import { CreateCourseValidate } from '@/api/modules/course/validations/create.course.validate';

@Controller('course')
export class CourseController {
  constructor(private readonly service: CourseService) {
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Post('create')
  @UsePipes(new ValidationPipe({
    transform: true,
    whitelist: true,
  }))
  create(@Body() course: CreateCourseValidate) {
    return this.service.create(course);
  }

  @Patch('publish_draft/:id')
  publishDraft(@Param('id') id: string) {
    return this.service.publishDraft(id);
  }

  @Put('update_draft/:id')
  @UsePipes(new ValidationPipe({
    transform: true,
    whitelist: true,
  }))
  updateDraft(@Param('id') id: string, @Body() course: CreateCourseValidate) {
    return this.service.updateDraft(id, course);
  }

  @Delete('delete_draft/:id')
  deleteDraft(@Param('id') id: string) {
    return this.service.deleteDraft(id);
  }
}
