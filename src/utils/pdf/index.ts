import PDFDocument from 'pdfkit';
import {
  IContractData,
  IPersonalCustomerData,
  IPersonalProviderData,
} from '../../@types/generateContaract';

export const generateTitle = (doc: PDFKit.PDFDocument) => {
  doc.fontSize(25).text('Contrato de prestação de serviço', 50, 160);
};

export const generateHeader = (
  doc: PDFKit.PDFDocument,
  personalCustomerData: IPersonalCustomerData,
  personalProviderData: IPersonalProviderData,
  headerText?: string
) => {
  const {
    customerFullName,
    customerDocument,
    customerCep,
    customerAddress,
    customerAddressNumber,
    customerComplement,
    customerCity,
    customerState,
  } = personalCustomerData;
  const {
    providerFullName,
    providerDocument,
    providerCep,
    providerAddress,
    providerAddressNumber,
    providerComplement,
    providerCity,
    providerState,
  } = personalProviderData;

  const headerTextValues: { [key: string]: string } = {
    CUSTOMERFULLNAME: customerFullName,
    CUSTOMERDOCUMENT: customerDocument,
    CUSTOMERADDRESS: `${customerAddress}, ${customerAddressNumber}, ${
      customerComplement ?? ''
    } ${customerCity}, ${customerState}`,
    CUSTOMERCEP: customerCep,

    PROVIDERFULLNAME: providerFullName,
    PROVIDERDOCUMENT: providerDocument,
    PROVIDERADDRESS: `${providerAddress}, ${providerAddressNumber}, ${
      providerComplement ? `${providerComplement}, ` : ``
    }${providerCity}, ${providerState}`,
    PROVIDERCEP: providerCep,
  };

  const newHeaderText = Object.keys(headerTextValues).reduce((actualText: string, key) => {
    if (actualText.includes(key)) {
      return actualText.replace(`{{${key}}}`, headerTextValues[key]);
    }

    return actualText;
  }, headerText || '');

  doc.fontSize(10).text(newHeaderText || '', 50, 50, { align: 'justify', width: 500 });
};

export const createContractPDF = (
  path: any,
  contractRequestData: IContractData,
  headerText?: string
) => {
  const { personalCustomerData, personalProviderData } = contractRequestData;

  const doc = new PDFDocument({ margin: 40 });

  doc.info.Title = 'Contrato de prestação de serviço';

  generateTitle(doc);
  generateHeader(doc, personalCustomerData, personalProviderData, headerText);

  // generateFooter(doc);

  doc.pipe(path);

  doc.end();

  return doc;
};
