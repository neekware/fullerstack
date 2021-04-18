export const environment = {
  production: true,
  port: 4301,
  prefix: 'api',
  serverOptions: { logger: true },
  graphqlOptions: {
    debug: false,
    playground: false,
    installSubscriptionHandlers: true,
    autoSchemaFile: 'schema.gql',
  },
  security: {
    expiresIn: '2m',
    refreshIn: '7d',
    bcryptSaltOrRound: 10,
  },
};
