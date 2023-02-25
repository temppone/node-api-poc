import request from 'supertest';
import { afterAll, beforeAll, describe, expect, it, test } from 'vitest';
import { app } from '../app';

describe('Transactions routes', () => {
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

  it('should be able to list all transacions', async () => {
    const createTransactionResponse = await request(app.server).post('/transactions').send({
      title: 'New transaction',
      amount: 500,
      type: 'credit',
    });

    const cookies = createTransactionResponse.get('Set-Cookie');

    const listTransactionsResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200);

    expect(listTransactionsResponse.body.transactions).toEqual([
      expect.objectContaining({ title: 'New transaction', amount: 500 }),
    ]);
  });
});
