/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 * that can be found at http://neekware.com/license/MIT.html
 */

import { Prisma } from '@prisma/client';

import { PRISMA_UNIQUE_CONSTRAIN_ERROR_CODE } from './prisma.constant';

export function isConstraintError(err: Error): boolean {
  const isConstraint =
    err instanceof Prisma.PrismaClientKnownRequestError &&
    err.code === PRISMA_UNIQUE_CONSTRAIN_ERROR_CODE;
  return isConstraint;
}
