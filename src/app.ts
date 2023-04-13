import cookie from '@fastify/cookie';
import fastify from 'fastify';
import cors from '@fastify/cors';
import { contractsRoutes } from './routes/contracts';

export const app = fastify();

app.register(cors, {
  origin: true,
});

app.register(cookie);

app.register(contractsRoutes, {
  prefix: 'contracts',
});
