import cookie from '@fastify/cookie';
import fastify from 'fastify';
import { contractsRoutes } from './routes/contracts';
import { transactionsRoutes } from './routes/transactions';

export const app = fastify();

app.register(cookie);

app.register(transactionsRoutes, {
  prefix: 'transactions',
});

app.register(contractsRoutes, {
  prefix: 'contracts',
});
