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
      session_id?: string;
    };

    contractsFormsInputs: {
      id: string;
      required: boolean;
      type: string;
      question_label: string;
      position: number;
      contract_type_id: string;
    };
  }
}
