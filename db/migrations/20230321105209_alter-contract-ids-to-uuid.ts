import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('contractsFormsInputs', (table) => {
    table.uuid('contract_type_id').notNullable().defaultTo('');
    table.foreign('contract_type_id').references('id').inTable('contractsForms');
  });

  await knex.schema.alterTable('contractClauses', (table) => {
    table.uuid('contract_id').notNullable().defaultTo('');
    table.foreign('contract_id').references('id').inTable('contracts');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('contractsFormsInputs', (table) => {
    table.dropColumn('contract_type_id');
  });

  await knex.schema.alterTable('contractClauses', (table) => {
    table.dropColumn('contract_id');
  });
}
