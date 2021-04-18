export const environment = {
  production: false,
  port: 4201,
  prefix: 'api',
  serverOptions: { logger: true },
  graphqlOptions: {
    debug: true,
    playground: true,
    autoSchemaFile: 'apps/api/src/prisma/schema.gql',
  },
  security: {
    expiresIn: '2m',
    refreshIn: '7d',
    bcryptSaltOrRound: 2,
  },
};
