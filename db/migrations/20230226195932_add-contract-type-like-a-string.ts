import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('contractsType', (table) => {
    table.string('type').unique().notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('contractsType', (table) => {
    table.dropColumn('type');
  });
}
