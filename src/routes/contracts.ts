import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import { knex } from '../database';

export const contractsRoutes = async (app: FastifyInstance) => {
  app.get('/types', async () => {
    const contractsTypes = await knex('contractsForms').select('type', 'id', 'label');

    return { contractsTypes };
  });

  app.get('/', async () => {
    const contractsTypes = await knex('contractsForms').select('*');

    return { contractsTypes };
  });

  app.get('/:type', async (request) => {
    const getContractTypeSchema = z.object({
      type: z.string(),
    });

    const { type } = getContractTypeSchema.parse(request.params);

    const contractForm = await knex('contractsForms').where({ type }).first();

    if (contractForm?.inputs) {
      contractForm.inputs = JSON.parse(contractForm.inputs);
    }

    return { contractType: contractForm };
  });

  app.post('/', async (request, reply) => {
    const createContractTypeSchema = z.object({
      type: z.enum(['design', 'development'], {
        required_error: 'Type is required.',
      }),
      label: z.string(),
      inputs: z.array(
        z.object({
          required: z.boolean(),
          type: z.enum([
            'select',
            'text',
            'radio',
            'currency',
            'personalProviderData',
            'personalClientData',
          ]),
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

    const { type, inputs, label } = createContractTypeSchema.parse(request.body);

    await knex('contractsForms').insert({
      id: randomUUID(),
      type,
      label,
      inputs: JSON.stringify(inputs),
    });

    return reply.status(201).send();
  });

  app.put('/:type', async (request) => {
    const createContractTypeSchema = z.object({
      type: z.enum(['design', 'development'], {
        required_error: 'Type is required.',
      }),
      label: z.string(),
      inputs: z.array(
        z.object({
          required: z.boolean(),
          type: z.enum([
            'select',
            'text',
            'radio',
            'currency',
            'personalProviderData',
            'personalClientData',
          ]),
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

    const { type, inputs, label } = createContractTypeSchema.parse(request.body);

    await knex('contractsForms')
      .where({ type })
      .update({ inputs: JSON.stringify(inputs), label });
  });

  app.delete('/:type', async (request) => {
    const deleteContractTypeSchema = z.object({
      type: z.string(),
    });

    const { type } = deleteContractTypeSchema.parse(request.params);

    await knex('contractsForms').where({ type }).delete();

    return { message: 'Contract type deleted.' };
  });
};
