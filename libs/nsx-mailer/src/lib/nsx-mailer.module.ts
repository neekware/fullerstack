import { Module } from '@nestjs/common';

import { NsxMailerService } from './nsx-mailer.service';

@Module({
  controllers: [],
  providers: [NsxMailerService],
  exports: [NsxMailerService],
})
export class NsxMailerModule {}
