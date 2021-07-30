/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { RequestDecorator } from '@fullerstack/nsx-auth';
import { ApplicationConfig, HttpRequest } from '@fullerstack/nsx-common';
import { I18nService } from '@fullerstack/nsx-i18n';
import { MailerService } from '@fullerstack/nsx-mailer';
import { PrismaService } from '@fullerstack/nsx-prisma';
import { ConfigService } from '@nestjs/config';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { DeepReadonly } from 'ts-essentials';

import { SystemContactUsInput, SystemStatusDto } from './system.model';
import { SystemService } from './system.service';

@Resolver(() => SystemStatusDto)
export class SystemResolver {
  readonly options: DeepReadonly<ApplicationConfig>;

  constructor(
    readonly config: ConfigService,
    readonly systemService: SystemService,
    readonly prisma: PrismaService,
    readonly mailer: MailerService,
    readonly i18n: I18nService
  ) {
    this.options = this.config.get<ApplicationConfig>('appConfig');
  }

  @Mutation(() => SystemStatusDto)
  async systemContactUs(
    @RequestDecorator() request: HttpRequest,
    @Args('input') payload: SystemContactUsInput
  ) {
    const user = request.user;
    const name = user ? `${user.firstName} ${user.lastName}` : payload.name;
    const email = user ? user.email : payload.email;

    this.mailer.sendMail({
      from: this.options.siteSupportEmail,
      to: email,
      subject: `${payload.subject} - (from: ${name})`,
      text: payload.body,
    });

    return { ok: true };
  }
}
