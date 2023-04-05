export interface IContractData {
  type: string;
  personalProviderData: IPersonalProviderData;
  personalCustomerData: IPersonalCustomerData;
  projectDuration: string;
  projectValue: string;
  observation?: string;
}

export interface IPersonalProviderData {
  providerCity: string;
  providerAddressNumber: number;
  providerComplement?: string;
  providerState: string;
  providerAddress: string;
  providerCep: string;
  providerDocument: string;
  providerFullName: string;
}

export interface IPersonalCustomerData {
  customerCity: string;
  customerAddressNumber: number;
  customerState: string;
  customerAddress: string;
  customerCep: string;
  customerDocument: string;
  customerFullName: string;
  customerComplement?: string;
}
