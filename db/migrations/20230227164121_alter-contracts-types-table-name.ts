import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.renameTable('contractsType', 'contractsForms');
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.renameTable('contractsForms', 'contractsType');
}
