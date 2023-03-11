import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('contractsFormsInputs', (table) => {
    table.integer('position').notNullable().defaultTo(1);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('contractsFormsInputs', (table) => {
    table.dropColumn('position');
  });
}
