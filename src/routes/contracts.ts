import { randomUUID } from 'crypto';
import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { knex } from '../database';
import { checkSessionIdExists } from '../middlewares/check-session-id-exists';

export const contractsRoutes = async (app: FastifyInstance) => {
  app.get(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request, reply) => {
      let { sessionId } = request.cookies;

      if (!sessionId) {
        sessionId = randomUUID();

        reply.cookie('sessionId', sessionId, {
          path: '/',
          maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        });
      }

      const contractsTypes = await knex('contractsType').select();

      return { contractsTypes };
    }
  );

  app.post('/', async (request, reply) => {
    const createContractTypeSchema = z.object({
      type: z.enum(['design', 'development']),
      inputs: z.array(
        z.object({
          required: z.boolean(),
          type: z.enum(['select', 'text']),
          questionLabel: z.string(),
          options: z
            .array(
              z.object({
                id: z.string(),
                label: z.string(),
              })
            )
            .optional(),
        })
      ),
    });

    const { inputs, type } = createContractTypeSchema.parse(request.body);

    const insertedData = await knex.transaction(async (trx) => {
      const contractTypeId = randomUUID();

      await trx('contractsForms').insert({
        id: contractTypeId,
        type,
      });

      const inputInserts = inputs.map((input) => ({
        id: randomUUID(),
        required: input.required,
        type: input.type,
        question_label: input.questionLabel,
        contract_type_id: contractTypeId,
      }));

      const insertedInputs = await trx('contractsFormsInputs').insert(inputInserts).returning('*');

      const contractFormsInputsOptionsInserts = insertedInputs.map((input) => ({
        id: randomUUID(),
      }));
    });

    // const existingContractType = await knex('contractsForms').where({ type }).first();

    // // contractsForms id, type
    // // contractsFormsInputs id, required, type, questionLabel, contractTypeId (required)
    // // contractFormsInputsOptions id, label contractsTypeInputId optional

    // if (existingContractType) {
    //   return reply.status(409).send('A contract type already exists');
    // }

    // await knex('contractsForms').insert({
    //   id: randomUUID(),
    //   type,
    // });

    // return reply.status(201).send();
  });
};
