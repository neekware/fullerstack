import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();
  });

  describe('Health Check', () => {
    it('should return health check ping:pong', () => {
      const appController = app.get<AppController>(AppController);
      expect(appController.ping()).toEqual({ ping: true });
    });
  });
});
