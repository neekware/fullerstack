import { Controller, Get } from '@nestjs/common';

import type { HealthCheck } from '@fullerstack/agx-dto';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('ping')
  ping(): HealthCheck {
    return this.appService.ping();
  }
}
