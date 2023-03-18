import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('contractClauses', (table) => {
    table.dropColumn('header');
    table.dropColumn('content');
    table.dropColumn('footer');
    table.string('type');
    table.string('text', 9999);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('contractClauses', (table) => {
    table.string('header').notNullable().defaultTo('');
    table.string('content').notNullable().defaultTo('');
    table.string('footer').notNullable().defaultTo('');
    table.dropColumn('type');
    table.dropColumn('text');
  });
}
