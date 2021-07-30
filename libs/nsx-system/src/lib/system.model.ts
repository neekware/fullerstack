/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { GqlStatusDto } from '@fullerstack/nsx-common';
import { Directive, Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export const SYS_CONTACT_NAME_MIN_LENGTH = 4;
export const SYS_CONTACT_SUBJECT_MIN_LENGTH = 7;
export const SYS_CONTACT_CONTENT_MIN_LENGTH = 15;

@ObjectType()
export class SystemStatusDto extends GqlStatusDto {}

/**
 * Contact Us input type (client -> server)
 */
@InputType()
export class SystemContactUsInput {
  @Field()
  @IsNotEmpty()
  @MinLength(SYS_CONTACT_NAME_MIN_LENGTH)
  name: string;

  @Directive('@lowercase')
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  @MinLength(SYS_CONTACT_SUBJECT_MIN_LENGTH)
  subject: string;

  @Field()
  @IsNotEmpty()
  @MinLength(SYS_CONTACT_CONTENT_MIN_LENGTH)
  content: string;
}
