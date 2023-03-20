import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('contractsForms', (table) => {
    table.uuid('id').primary();
    table.string('type').unique().notNullable();
    table.string('label').notNullable().defaultTo('');
    table.integer('position').notNullable().defaultTo(1);
  });

  await knex.schema.createTable('contractsFormsInputs', (table) => {
    table.uuid('id').primary();
    table.boolean('required').notNullable();
    table.string('type').notNullable();
    table.string('question_label').notNullable();
    table.string('contract_type_id').notNullable();
    table.foreign('contract_type_id').references('id').inTable('contractsForms');
    table.string('name').notNullable().defaultTo('');
  });

  await knex.schema.createTable('contracts', (table) => {
    table.uuid('id').primary();
    table.string('type').notNullable().defaultTo('');
  });

  await knex.schema.createTable('contractClauses', (table) => {
    table.uuid('id').primary();
    table.string('type');
    table.string('text', 9999);
    table.string('contract_id').notNullable().defaultTo('');
    table.foreign('contract_id').references('id').inTable('contracts');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('contractClauses');
  await knex.schema.dropTable('contracts');
  await knex.schema.dropTable('contractsFormsInputs');
  await knex.schema.dropTable('contractsForms');
}
