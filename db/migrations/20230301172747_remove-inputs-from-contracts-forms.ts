import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('contractsForms', (table) => {
    table.dropColumn('inputs');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('contractsForms', (table) => {
    table.jsonb('inputs').notNullable();
  });
}
