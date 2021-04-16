export const environment = {
  production: false,
  port: 4201,
  prefix: 'api',
  bcryptSaltOrRound: 2,
  serverOptions: { logger: true },
  graphqlOptions: {
    debug: true,
    playground: true,
    autoSchemaFile: 'apps/api/src/app/schema.gql',
  },
  ormConfig: {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'val',
    password: 'valDaMan',
    database: 'fullerstack',
    logging: true,
    synchronize: true,
    migrations: ['migration/*.ts'],
    entities: [
      `${__dirname}../../../../dist/**/*.entity.js`,
      `${__dirname}/../**/*.entity.ts`,
    ],
  },
};
