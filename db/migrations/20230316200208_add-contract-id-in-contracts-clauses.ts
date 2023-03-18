import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('contractClauses', (table) => {
    table.string('contract_id').notNullable().defaultTo('');
    table.foreign('contract_id').references('id').inTable('contracts');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('contractsClauses', (table) => {
    table.dropColumn('contract_id');
  });
}
