import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('contractsFormsInputs', (table) => {
    table.uuid('id').primary();
    table.boolean('required').notNullable();
    table.string('type').notNullable();
    table.string('question_label').notNullable();
    table.string('contract_type_id').notNullable();
    table.foreign('contract_type_id').references('id').inTable('contractsForms');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('contractsFormsInputs');
}
