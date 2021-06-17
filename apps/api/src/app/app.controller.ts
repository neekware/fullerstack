import type { HealthCheck } from '@fullerstack/agx-dto';
import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(readonly appService: AppService) {}

  @Get('ping')
  ping(): HealthCheck {
    return this.appService.ping();
  }
}
