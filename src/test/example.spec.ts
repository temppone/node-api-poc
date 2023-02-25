import request from 'supertest';
import { afterAll, beforeAll, test } from 'vitest';
import { app } from '../app';

beforeAll(async () => {
  await app.ready();
});

afterAll(async () => {
  await app.close();
});

test('Create a new transition', async () => {
  await request(app.server)
    .post('/transactions')
    .send({
      title: 'New transaction',
      amount: 500,
      type: 'credit',
    })
    .expect(201);
});
