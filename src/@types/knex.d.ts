/* eslint-disable @typescript-eslint/no-unused-vars */
import { knex } from 'knex';

declare module 'knex/types/tables' {
  export interface Tables {
    transactions: {
      id: string;
      title: string;
      amount: number;
      created_at: string;
      session_id?: string;
    };

    contractsForms: {
      id: string;
      type: string;
      label: string;
      inputs: string;
      session_id?: string;
    };
  }
}
