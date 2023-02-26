import { randomUUID } from 'crypto';
import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { knex } from '../database';
import { checkSessionIdExists } from '../middlewares/check-session-id-exists';

export const contractsTypesRoutes = async (app: FastifyInstance) => {
  app.get('/:type', async (request, reply) => {
    const getContractTypeParamsSchema = z.object({
      type: z.string(),
    });

    let { sessionId } = request.cookies;

    if (!sessionId) {
      sessionId = randomUUID();

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      });
    }

    const { type } = getContractTypeParamsSchema.parse(request.params);

    const formQuestions = await knex('contractsType').where({ type }).first();

    return { formQuestions };
  });

  app.get(
    '/',
    {
      preHandler: [checkSessionIdExists],
    },
    async (request) => {
      const { sessionId } = request.cookies;

      console.log({ sessionId });

      const contractsTypes = await knex('contractsType')
        .where({ session_id: sessionId })
        .select('type');

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

    const existingContractType = await knex('contractsType').where({ type }).first();

    if (existingContractType) {
      return reply.status(409).send('A contract type already exists');
    }

    await knex('contractsType').insert({
      id: randomUUID(),
      type,
      inputs,
    });

    return reply.status(201).send();
  });
};
