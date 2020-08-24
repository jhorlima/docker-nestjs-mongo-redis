import { Test, TestingModule } from '@nestjs/testing';

// import { AppService } from '@/api/modules/app/services/app.service';
import { AppController } from '@/api/modules/app/controllers/app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ AppController ],
      providers: [ /*AppService*/ ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Data from cache: getHello');
    });
  });
});
