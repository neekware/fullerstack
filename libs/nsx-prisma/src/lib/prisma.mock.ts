/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 * that can be found at http://neekware.com/license/MIT.html
 */

import { mockDeep } from 'jest-mock-extended';

import { PrismaService } from './prisma.service';

export function getMockPrismaService() {
  const prisma = mockDeep<PrismaService>();
  prisma.$connect.mockResolvedValue(Promise.resolve());
  prisma.$disconnect.mockResolvedValue(Promise.resolve());
  return prisma;
}
