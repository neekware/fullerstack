export const environment = {
  production: true,
  port: 4401,
  prefix: 'api',
  serverOptions: { logger: true },
  graphqlOptions: {
    debug: false,
    playground: false,
    installSubscriptionHandlers: true,
    autoSchemaFile: 'schema.gql',
  },
};
