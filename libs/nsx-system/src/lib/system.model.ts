/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { ApiConstants } from '@fullerstack/agx-dto';
import { GqlStatusDto } from '@fullerstack/nsx-common';
import { Directive, Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

@ObjectType()
export class SystemStatusDto extends GqlStatusDto {}

/**
 * Contact Us input type (client -> server)
 */
@InputType()
export class SystemContactUsInput {
  @Field()
  @IsNotEmpty()
  @MinLength(ApiConstants.NAME_MIN_LENGTH)
  name: string;

  @Directive('@lowercase')
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  @MinLength(ApiConstants.EMAIL_SUBJECT_MIN_LENGTH)
  subject: string;

  @Field()
  @IsNotEmpty()
  @MinLength(ApiConstants.EMAIL_BODY_MIN_LENGTH)
  body: string;
}
