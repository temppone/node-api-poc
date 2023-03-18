import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('contracts', (table) => {
    table.uuid('id').primary();
    table.string('type').notNullable().defaultTo('');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('contracts');
}
