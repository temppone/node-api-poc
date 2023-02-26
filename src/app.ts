import cookie from '@fastify/cookie';
import fastify from 'fastify';
import { contractsTypesRoutes } from './routes/contractsTypes';
import { transactionsRoutes } from './routes/transactions';

export const app = fastify();

app.register(cookie);

app.register(transactionsRoutes, {
  prefix: 'transactions',
});

app.register(contractsTypesRoutes, {
  prefix: 'contractsType',
});
