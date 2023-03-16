export interface IContractBody {
  type: string;
  personalProviderData: PersonalProviderData;
  personalCustomerData: PersonalCustomerData;
  projectDuration: string;
  projectValue: string;
  observation: string;
}

export interface PersonalProviderData {
  providerCity: string;
  providerAddressNumber: number;
  providerComplement: string;
  providerState: string;
  providerAddress: string;
  providerCep: string;
  providerDocument: string;
  providerFullName: string;
}

export interface PersonalCustomerData {
  customerCity: string;
  customerAddressNumber: number;
  customerState: string;
  customerAddress: string;
  customerCep: string;
  customerDocument: string;
  customerFullName: string;
  customerComplement: string;
}
