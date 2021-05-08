import { HealthCheck } from '@fullerstack/agx-dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  ping(): HealthCheck {
    return { ping: true };
  }
}
