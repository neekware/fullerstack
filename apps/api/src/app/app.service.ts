import { Injectable } from '@nestjs/common';
import { HealthCheck } from '@fullerstack/agx-dto';

@Injectable()
export class AppService {
  ping(): HealthCheck {
    return { ping: true };
  }
}
