import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('contractClauses', (table) => {
    table.uuid('id').primary();
    table.string('header').notNullable().defaultTo('');
    table.string('content').notNullable().defaultTo('');
    table.string('footer').notNullable().defaultTo('');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('contractClauses');
}
