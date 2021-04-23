import { Permission, PrismaClient, Role } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const rachelTheSuperuser = await prisma.user.upsert({
    where: { email: 'rachel@fullerstack.net' },
    update: {},
    create: {
      email: 'rachel@fullerstack.net',
      username: 'RachelGreen',
      firstName: 'Rachel',
      lastName: 'Green',
      password: 'pass4rachel',
      role: Role.SUPERUSER,
      permissions: [Permission.appALL],
    },
  });

  const monicaTheAdmin = await prisma.user.upsert({
    where: { email: 'monica@fullerstack.net' },
    update: {},
    create: {
      email: 'monica@fullerstack.net',
      username: 'MonicaGeller',
      firstName: 'Monica',
      lastName: 'Geller',
      password: 'pass4monica',
      role: Role.ADMIN,
      permissions: [Permission.appALL],
    },
  });

  const joeyTheStaff = await prisma.user.upsert({
    where: { email: 'joey@fullerstack.net' },
    update: {},
    create: {
      email: 'joey@fullerstack.net',
      username: 'JoeyTribbiani',
      firstName: 'Joey',
      lastName: 'Tribbiani',
      password: 'pass4joey',
      role: Role.STAFF,
      permissions: [
        Permission.groupALL,
        Permission.userCREATE,
        Permission.userREAD,
        Permission.userUPDATE,
        Permission.groupREAD,
      ],
    },
  });

  const rossTheUser = await prisma.user.upsert({
    where: { email: 'ross@fullerstack.net' },
    update: {},
    create: {
      email: 'ross@fullerstack.net',
      username: 'RossGeller',
      firstName: 'Ross',
      lastName: 'Geller',
      password: 'pass4ross',
      role: Role.USER,
      permissions: [
        Permission.userCREATE,
        Permission.userREAD,
        Permission.userUPDATE,
        Permission.userDELETE,
      ],
    },
  });

  const chandlerTheUser = await prisma.user.upsert({
    where: { email: 'chandler@fullerstack.net' },
    update: {},
    create: {
      email: 'chandler@fullerstack.net',
      username: 'ChandlerBing',
      firstName: 'Chandler',
      lastName: 'Bing',
      password: 'pass4chandler',
      role: Role.USER,
      permissions: [
        Permission.userCREATE,
        Permission.userREAD,
        Permission.userUPDATE,
        Permission.userDELETE,
      ],
    },
  });

  const phoebeTheUser = await prisma.user.upsert({
    where: { email: 'phoebe@fullerstack.net' },
    update: {},
    create: {
      email: 'phoebe@fullerstack.net',
      username: 'PhoebeBuffay',
      firstName: 'Phoebe',
      lastName: 'Buffay',
      password: 'pass4phoebe',
      role: Role.USER,
      permissions: [
        Permission.userCREATE,
        Permission.userREAD,
        Permission.userUPDATE,
        Permission.userDELETE,
      ],
    },
  });

  console.log({
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
