import { FastifyInstance } from 'fastify';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { knex } from '../database';
import { createContractPDF } from '../utils/pdf';

export const contractsRoutes = async (app: FastifyInstance) => {
  app.get('/form/types', async () => {
    const contractsFormsTypes = await knex('contractsForms').select('type', 'id', 'label');

    return { contractsFormsTypes };
  });

  app.get('/contract/clauses', async () => {
    const contractClauses = await knex('contractClauses').select(
      'type',
      'id',
      'text',
      'contract_id'
    );

    return { contractClauses };
  });

  app.get('/', async () => {
    const contractsTypes = await knex('contractsForms').select('*');

    return { contractsTypes };
  });

  app.get('/contract/types', async () => {
    const contractsTypes = await knex('contracts').select('*');

    return { contractsTypes };
  });

  app.get('/form/:type', async (request) => {
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

  app.post('/form', async (request, reply) => {
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
            'date',
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

  app.post('/contract/type', async (request, reply) => {
    const createContractTypeSchema = z.object({
      type: z.string({
        required_error: 'Type is required.',
      }),
    });

    const { type } = createContractTypeSchema.parse(request.body);

    const contractFormId = randomUUID();

    await knex('contracts').insert({
      id: contractFormId,
      type,
    });

    return reply.status(201).send();
  });

  app.post('/generate', async (request, reply) => {
    const generateContractSchema = z.object({
      type: z.string(),
      projectDuration: z.string(),
      projectValue: z.string(),
      observation: z.string().optional(),
      contract_id: z.string(),

      personalProviderData: z.object({
        providerCity: z.string(),
        providerAddressNumber: z.number(),
        providerComplement: z.string().optional(),
        providerState: z.string(),
        providerAddress: z.string(),
        providerCep: z.string(),
        providerDocument: z.string(),
        providerFullName: z.string(),
      }),

      personalCustomerData: z.object({
        customerCity: z.string(),
        customerAddressNumber: z.number(),
        customerComplement: z.string().optional(),
        customerState: z.string(),
        customerAddress: z.string(),
        customerCep: z.string(),
        customerDocument: z.string(),
        customerFullName: z.string(),
      }),
    });

    // Pelo presente instrumento particular, de um lado [customerFullName], [customerDocument], residente e domiciliado(a) na [customerAddress], CEP [customerCep], doravante denominado simplesmente 'Contratante', e de outro lado [providerFullName], [providerDocument], residente e domiciliado(a) na [providerAddress], CEP [providerCep], doravante denominado simplesmente 'Contratado', têm entre si justo e contratado o seguinte:
    // 1. Objeto do contrato: O presente contrato tem por objeto a prestação de serviços de design gráfico pelo Contratado, conforme descrito no documento 'Briefing' elaborado pelo Contratante e que faz parte integrante deste instrumento.2. Prazo: O prazo de duração do projeto será de [PROJECTDURATION], a contar da data de assinatura deste contrato pelas partes. 3. Remuneração: Pela prestação dos serviços objeto deste contrato, o Contratante pagará ao Contratado o valor total de R$ [PROJECTVALUE].4. Obrigações do Contratado: O Contratado se compromete a desenvolver os serviços objeto deste contrato com zelo, dedicação e profissionalismo, obedecendo ao prazo estipulado e ao briefing elaborado pelo Contratante. 5. Obrigações do Contratante: O Contratante se compromete a fornecer todas as informações e materiais necessários para a realização dos serviços objeto deste contrato, bem como a pagar a remuneração devida nas condições estipuladas. 6. Propriedade intelectual: Todos os direitos de propriedade intelectual relativos aos serviços prestados pelo Contratado serão de propriedade exclusiva do Contratante. 7. Rescisão: O presente contrato poderá ser rescindido por qualquer das partes, a qualquer momento, mediante notificação por escrito, com antecedência mínima de 15 dias. 8. Foro: Fica eleito o foro da Comarca de [PROVIDERCITY] - [PROVIDERSTATE], para dirimir quaisquer dúvidas ou controvérsias oriundas deste contrato, renunciando as partes a qualquer outro, por mais privilegiado que seja.
    try {
      const requestBody = generateContractSchema.parse(request.body);

      const headerData = await knex('contractClauses')
        .where({ contract_id: requestBody.contract_id, type: 'header' })
        .first();

      const contentData = await knex('contractClauses')
        .where({ contract_id: requestBody.contract_id, type: 'content' })
        .first();

      const buffer = await createContractPDF(
        reply,
        requestBody,
        headerData?.text,
        contentData?.text
      );

      reply
        .header('Content-Disposition', `attachment; filename=Contrato.pdf`)
        .type('application/pdf')
        .code(200)
        .send(buffer);
    } catch (err) {
      console.log(err);
    }
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

  app.put('/form/:type', async (request) => {
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

  app.delete('/form/:type', async (request) => {
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

  app.delete('/contract/:id', async (request) => {
    const deleteContractSchema = z.object({
      id: z.string(),
    });

    const { id } = deleteContractSchema.parse(request.params);

    const contract = await knex('contracts').where({ id }).first();

    await knex('contracts')
      .where({
        id: contract?.id,
      })
      .del();

    await knex('contracts').where({ id }).del();

    return { message: 'Contract type deleted.' };
  });

  app.delete('/clause/:id', async (request) => {
    const deleteClauseIdSchema = z.object({
      id: z.string(),
    });

    const { id } = deleteClauseIdSchema.parse(request.params);

    const clause = await knex('contractClauses').where({ id }).first();

    await knex('contractClauses')
      .where({
        id: clause?.id,
      })
      .del();

    await knex('contractClauses').where({ id }).del();

    return { message: 'Contract type deleted.' };
  });
};
