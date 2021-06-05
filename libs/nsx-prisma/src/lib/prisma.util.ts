import { Prisma } from '@prisma/client';

import { PRISMA_UNIQUE_CONSTRAIN_ERROR_CODE } from './prisma.constant';

export function isConstraintError(err: Error): boolean {
  const isConstraint =
    err instanceof Prisma.PrismaClientKnownRequestError &&
    err.code === PRISMA_UNIQUE_CONSTRAIN_ERROR_CODE;
  return isConstraint;
}
