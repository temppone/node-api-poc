/* eslint-disable import/no-extraneous-dependencies */
import { knex as setupKnex, Knex } from 'knex';
import { env } from './env';

const databaseUrl =
  env.DATABASE_CLIENT === 'sqlite'
    ? {
        filename: env.DATABASE_URL,
      }
    : env.DATABASE_URL;

export const config: Knex.Config = {
  client: env.DATABASE_CLIENT,
  connection: databaseUrl,
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },

  useNullAsDefault: true,
};

export const knex = setupKnex(config);
