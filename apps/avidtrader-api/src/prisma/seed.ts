/**
 * @license
 * Copyright Neekware Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 * that can be found at http://neekware.com/license/MIT.html
 */

import { Permission, PrismaClient, Role } from '@prisma/client';
import { hash } from 'bcrypt';
import { v4 as uuid_v4 } from 'uuid';

const prisma = new PrismaClient();

async function hashPassword(password?: string): Promise<string> {
  password = password || uuid_v4();
  return await hash(password, 10);
}

/**
 * WARNING - For use during development ONLY
 */
async function main() {
  // Create Superuser Group
  const superuserGroupData = {
    name: 'Superuser',
    isActive: true,
  };

  const superuserGroup = await prisma.group.upsert({
    where: { name: 'Superuser' },
    update: superuserGroupData,
    create: superuserGroupData,
  });

  // Create Admin Group
  const adminGroupData = {
    name: 'Admin',
    isActive: true,
  };

  const adminGroup = await prisma.group.upsert({
    where: { name: 'Admin' },
    update: adminGroupData,
    create: adminGroupData,
  });

  // Create Staff Group
  const staffGroupData = {
    name: 'Staff',
    isActive: true,
  };

  const staffGroup = await prisma.group.upsert({
    where: { name: 'Staff' },
    update: staffGroupData,
    create: staffGroupData,
  });

  const rachelData = {
    email: 'rachel@fullerstack.net',
    username: 'RachelGreen',
    firstName: 'Rachel',
    lastName: 'Green',
    password: await hashPassword('pass4rachel'),
    isActive: true,
    isVerified: true,
    lastLoginAt: new Date(),
    role: Role.SUPERUSER,
    permissions: [Permission.appALL],
  };

  const rachelTheSuperuser = await prisma.user.upsert({
    where: { email: 'rachel@fullerstack.net' },
    update: rachelData,
    create: rachelData,
  });

  const monicaData = {
    email: 'monica@fullerstack.net',
    username: 'MonicaGeller',
    firstName: 'Monica',
    lastName: 'Geller',
    password: await hashPassword('pass4monica'),
    isActive: true,
    isVerified: true,
    lastLoginAt: new Date(),
    role: Role.ADMIN,
    permissions: [Permission.appALL],
  };

  const monicaTheAdmin = await prisma.user.upsert({
    where: { email: 'monica@fullerstack.net' },
    update: monicaData,
    create: monicaData,
  });

  const joeyData = {
    email: 'joey@fullerstack.net',
    username: 'JoeyTribbiani',
    firstName: 'Joey',
    lastName: 'Tribbiani',
    password: await hashPassword('pass4joey'),
    isActive: true,
    isVerified: true,
    lastLoginAt: new Date(),
    role: Role.STAFF,
    permissions: [
      Permission.groupALL,
      Permission.userCREATE,
      Permission.userREAD,
      Permission.userUPDATE,
      Permission.groupREAD,
    ],
  };

  const joeyTheStaff = await prisma.user.upsert({
    where: { email: 'joey@fullerstack.net' },
    update: joeyData,
    create: joeyData,
  });

  const rossData = {
    email: 'ross@fullerstack.net',
    username: 'RossGeller',
    firstName: 'Ross',
    lastName: 'Geller',
    password: await hashPassword('pass4ross'),
    isActive: true,
    isVerified: true,
    role: Role.USER,
    lastLoginAt: new Date(),
    permissions: [
      Permission.userCREATE,
      Permission.userREAD,
      Permission.userUPDATE,
      Permission.userDELETE,
    ],
  };

  const rossTheUser = await prisma.user.upsert({
    where: { email: 'ross@fullerstack.net' },
    update: rossData,
    create: rossData,
  });

  const chandlerData = {
    email: 'chandler@fullerstack.net',
    username: 'ChandlerBing',
    firstName: 'Chandler',
    lastName: 'Bing',
    password: await hashPassword('pass4chandler'),
    isActive: true,
    isVerified: true,
    lastLoginAt: new Date(),
    role: Role.USER,
    permissions: [
      Permission.userCREATE,
      Permission.userREAD,
      Permission.userUPDATE,
      Permission.userDELETE,
    ],
  };

  const chandlerTheUser = await prisma.user.upsert({
    where: { email: 'chandler@fullerstack.net' },
    update: chandlerData,
    create: chandlerData,
  });

  const phoebeData = {
    email: 'phoebe@fullerstack.net',
    username: 'PhoebeBuffay',
    firstName: 'Phoebe',
    lastName: 'Buffay',
    password: await hashPassword('pass4phoebe'),
    isActive: true,
    isVerified: true,
    lastLoginAt: new Date(),
    role: Role.USER,
    permissions: [
      Permission.userCREATE,
      Permission.userREAD,
      Permission.userUPDATE,
      Permission.userDELETE,
    ],
  };

  const phoebeTheUser = await prisma.user.upsert({
    where: { email: 'phoebe@fullerstack.net' },
    update: phoebeData,
    create: phoebeData,
  });

  console.log({
    staffGroup,
    superuserGroup,
    adminGroup,
    rachelTheSuperuser,
    monicaTheAdmin,
    joeyTheStaff,
    rossTheUser,
    chandlerTheUser,
    phoebeTheUser,
  });
}

let status = 0;

main()
  .catch(async (e) => {
    console.error(e);
    status = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(status);
  });
