/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by a proprietary notice
 * that can be found at http://neekware.com/license/PRI.html
 */

import { mockDeep } from 'jest-mock-extended';

import { PrismaService } from './prisma.service';

export function getMockPrismaService() {
  const prisma = mockDeep<PrismaService>();
  prisma.$connect.mockResolvedValue(Promise.resolve());
  prisma.$disconnect.mockResolvedValue(Promise.resolve());
  return prisma;
}
