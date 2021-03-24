import { Controller, Get } from '@nestjs/common';

import type { Message } from '@fullerstack/api-dto';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('ping')
  ping(): Message {
    return this.appService.ping();
  }

  @Get('hello')
  getData(): Message {
    return this.appService.getData();
  }
}
