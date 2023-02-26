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

    contractsType: {
      id: string;
      type: string;
      session_id?: string;
      inputs: {
        options?:
          | {
              id: string;
              label: string;
            }[]
          | undefined;
        type: 'select' | 'text';
        required: boolean;
        questionLabel: string;
      }[];
    };
  }
}
