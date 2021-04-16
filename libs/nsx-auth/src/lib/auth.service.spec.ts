import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeTruthy();
  });
});
