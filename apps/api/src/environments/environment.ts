export const environment = {
  production: false,
  port: 4201,
  prefix: 'api',
  serverOptions: { logger: true },
  graphqlOptions: {
    debug: true,
    playground: true,
    installSubscriptionHandlers: true,
    autoSchemaFile: 'schema.gql',
  },
};
