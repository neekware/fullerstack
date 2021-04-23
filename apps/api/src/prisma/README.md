## Manually created / updated

### `schema.prisma`

Description: `schema.prisma` is the shape of our database and it is created and
updated by developers

## Automatically generated

### `migrations/\*`

Description: All files in the migration directory are automatically generated

When `schema.prisma` is altered the following command must be run to ensure
our `database schema` reflects our new changes in `schema.prisma`.

- to create: `yarn prisma:migration:create
- to apply: `yarn prisma:migration:apply

### `dbml/\*`

Description: A `schema.dbml` file is generated to visually assist with the
verification of our `database schema`

- to create/update: `yarn prisma:generate`
- to view: upload the `schema.dbml` file to https://dbdiagram.io/d

### `schema.gql`

Description: A `schema.gql` is created/updated upon running the backend server
to reflect the latest of the main `schema.prisma` file

- to create/update: `yarn serve api`

### `seed.ts`

Description: A `seed.ts` is manually created to insert initial fixture into the database.
This is a great tool for creating things like groups, superuser, etc. It also can be a great
tool for manually overwriting a superuser account in case of a security breach.

- to create/update: `yarn serve api`

## Note

- All files/folders under this prisma directory are under version control
- The seed command seems to be working ONLY under specific node version. The last working version is `nvm install v12.18.4`.
