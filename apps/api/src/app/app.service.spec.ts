import { Test } from '@nestjs/testing';

import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = app.get<AppService>(AppService);
  });

  describe('Health Check', () => {
    it('should return health check ping:pong', () => {
      expect(service.ping()).toEqual({ ping: true });
    });
  });
});
