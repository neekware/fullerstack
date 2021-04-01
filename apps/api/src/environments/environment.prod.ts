export const environment = {
  production: true,
  port: 4301,
  prefix: 'api',
  bcryptSaltOrRound: 10,
  serverOptions: { logger: true },
  graphqlOptions: {
    debug: false,
    playground: false,
    installSubscriptionHandlers: true,
    autoSchemaFile: 'schema.gql',
  },
};
