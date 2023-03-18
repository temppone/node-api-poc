import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('contractsForms', (table) => {
    table.string('label').notNullable().defaultTo('');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('contractsForms', (table) => {
    table.dropColumn('label');
  });
}
