import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('contractsFormsInputs', (table) => {
    table.string('name').notNullable().defaultTo('');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('contractsFormsInputs', (table) => {
    table.dropColumn('name');
  });
}
