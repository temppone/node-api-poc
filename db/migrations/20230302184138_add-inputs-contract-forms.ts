import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('contractsForms', (table) => {
    table.text('inputs');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('contractsForms', (table) => {
    table.dropColumn('inputs');
  });
}
