import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('contractsType', (table) => {
    table.uuid('id').primary();
    table.enum('type', ['design, development']).unique().notNullable();
    table.jsonb('inputs').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('contractsType');
}
