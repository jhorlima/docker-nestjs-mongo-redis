import { HttpException, HttpStatus } from '@nestjs/common';

export abstract class CourseException extends HttpException {
}

export class CourseInternalError extends CourseException {
  constructor(error: any) {
    super('Não foi possível processar essa requisição.', HttpStatus.NOT_ACCEPTABLE);
    console.error(error);
  }
}

export class CourseNotFound extends CourseException {
  constructor(error: any) {
    super('Curso não encontrado.', HttpStatus.NOT_FOUND);
    console.error(error);
  }
}

export class CourseNotCreated extends CourseException {
  constructor(error: any) {
    super(`O curso não foi criado.`, HttpStatus.BAD_REQUEST);
    console.error(error);
  }
}

export class CourseWithoutDraft extends CourseException {
  constructor(error: any) {
    super(`Não há rascunho disponível para este curso.`, HttpStatus.NOT_MODIFIED);
    console.error(error);
  }
}
