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

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
