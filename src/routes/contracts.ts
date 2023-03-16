import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import PDFDocument from 'pdfkit';
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

    const inputs = await knex('contractsFormsInputs')
      .where({ contract_type_id: contractForm?.id })
      .orderBy('position');

    return { contractFormType: { ...contractForm, inputs } };
  });

  app.post('/', async (request, reply) => {
    const createContractTypeSchema = z.object({
      type: z.enum(['design', 'development'], {
        required_error: 'Type is required.',
      }),
      label: z.string(),
      inputs: z.array(
        z.object({
          type: z.enum([
            'select',
            'text',
            'radio',
            'currency',
            'personalProviderData',
            'personalClientData',
          ]),
          required: z.boolean(),
          questionLabel: z.string(),
          name: z.string(),
          position: z.number(),
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

    const contractFormId = randomUUID();

    await knex('contractsForms').insert({
      id: contractFormId,
      type,
      label,
    });

    inputs.forEach(async (input) => {
      await knex('contractsFormsInputs').insert({
        id: randomUUID(),
        type: input.type,
        question_label: input.questionLabel,
        contract_type_id: contractFormId,
        position: input.position,
        required: input.required,
        name: input.name,
      });
    });

    return reply.status(201).send();
  });

  app.post('/generate', async (request, reply) => {
    const generateContractSchema = z.object({
      type: z.string(),
      projectDuration: z.string(),
      projectValue: z.string(),
      observation: z.string(),

      personalProviderData: z.object({
        providerCity: z.string(),
        providerAddressNumber: z.number(),
        providerComplement: z.string(),
        providerState: z.string(),
        providerAddress: z.string(),
        providerCep: z.string(),
        providerDocument: z.string(),
        providerFullName: z.string(),
      }),

      personalCustomerData: z.object({
        customerCity: z.string(),
        customerAddressNumber: z.number(),
        customerComplement: z.string(),
        customerState: z.string(),
        customerAddress: z.string(),
        customerCep: z.string(),
        customerDocument: z.string(),
        customerFullName: z.string(),
      }),
    });

    let { sessionId } = request.cookies;

    if (!sessionId) {
      sessionId = randomUUID();

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      });
    }

    const { type } = generateContractSchema.parse(request.body);

    const doc = new PDFDocument();

    console.log(type);

    reply.header('Content-Type', 'application/pdf');
    reply.header('Content-Disposition', `attachment; filename=Contrato.pdf`);

    doc.pipe(reply.raw);

    doc.info.Title = 'Contrato de prestação de serviço';

    doc.end();

    return reply;
  });

  app.post('/clause', async (request) => {
    const contractClauseSchema = z.object({
      contractId: z.string(),
      type: z.string(),
      text: z.string(),
    });

    const { contractId, type, text } = contractClauseSchema.parse(request.body);

    await knex('contractClauses').insert({
      id: randomUUID(),
      contract_id: contractId,
      type,
      text,
    });
  });

  app.put('/:type', async (request) => {
    const createContractTypeSchema = z.object({
      type: z.enum(['design', 'development'], {
        required_error: 'Type is required.',
      }),
      name: z.string({
        required_error: 'Name is required.',
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
          name: z.string(),
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

    await knex('contractsForms').where({ type }).update({ label });

    const contractForm = await knex('contractsForms').where({ type }).first();

    inputs.forEach(async (input) => {
      await knex('contractsFormsInputs').update({
        type: input.type,
        question_label: input.questionLabel,
        contract_type_id: contractForm?.id,
        required: input.required,
        name: input.name,
      });
    });
  });

  app.delete('/:type', async (request) => {
    const deleteContractTypeSchema = z.object({
      type: z.string(),
    });

    const { type } = deleteContractTypeSchema.parse(request.params);

    const contractForm = await knex('contractsForms').where({ type }).first();

    await knex('contractsFormsInputs')
      .where({
        contract_type_id: contractForm?.id,
      })
      .del();

    await knex('contractsForms').where({ type }).del();

    return { message: 'Contract type deleted.' };
  });
};
