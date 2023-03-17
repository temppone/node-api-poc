import PDFDocument from 'pdfkit';
import {
  IContractData,
  IPersonalCustomerData,
  IPersonalProviderData,
} from '../../@types/generateContaract';

export const generateHeader = (
  doc: PDFKit.PDFDocument,
  personalCustomerData: IPersonalCustomerData,
  personalProviderData: IPersonalProviderData,
  headerText?: string
) => {
  const { customerFullName, customerCep, customerDocument } = personalCustomerData;
  const { providerFullName, providerDocument, providerCep } = personalProviderData;

  const headerTextValues: { [key: string]: string } = {
    // customerCity: string;
    // customerAddressNumber: number;
    // customerState: string;
    // customerAddress: string;
    // customerComplement: string;
    CUSTOMERFULLNAME: customerFullName,
    CUSTOMERCEP: customerCep,
    CUSTOMERDOCUMENT: customerDocument,
    PROVIDERFULLNAME: providerFullName,
    PROVIDERCEP: providerCep,
    PROVIDERDOCUMENT: providerDocument,
  };

  const newHeaderText = Object.keys(headerTextValues).reduce((actualText: string, key) => {
    if (actualText.includes(headerTextValues[key])) {
      return actualText.replace(`{{${key}}}`, headerTextValues[key]);
    }

    return actualText;
  }, headerText || '');

  console.log({ newHeaderText });

  doc.fontSize(10).text(newHeaderText || '', 50, 50, { align: 'justify', width: 500 });
};

export const createContractPDF = (
  path: any,
  contractRequestData: IContractData,
  headerText?: string
) => {
  const { personalCustomerData, personalProviderData } = contractRequestData;

  const doc = new PDFDocument({ margin: 40 });

  console.log({ headerText });

  doc.info.Title = 'Contrato de prestação de serviço';

  generateHeader(doc, personalCustomerData, personalProviderData, headerText);

  // generateTitle(doc);
  // generateContent(doc);
  // generateFooter(doc);

  doc.pipe(path);

  doc.end();

  return doc;
};
