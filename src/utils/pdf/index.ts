import { FastifyReply } from 'fastify';
import PDFDocument from 'pdfkit';
import { Writable } from 'stream';
import { IContractData } from '../../@types/generateContaract';

export const createContractPDF = async (
  response: FastifyReply,
  contractRequestData: IContractData,
  headerText?: string
) => {
  const { personalCustomerData, personalProviderData } = contractRequestData;

  const doc = new PDFDocument({ margin: 40 });

  doc.info.Title = 'Contrato de prestação de serviço';

  doc.fillColor('black').fontSize(25).text('Contrato de prestação de serviço', 50, 160);

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
      return actualText.replace(`[${key}]`, headerTextValues[key]);
    }

    return actualText;
  }, headerText || '');

  doc.fontSize(10).text(newHeaderText || '', 50, 50, { align: 'justify', width: 500 });

  // generateFooter(doc);

  const buffer = await new Promise((resolve, reject) => {
    const chunks: any[] = [];

    const stream = new Writable({
      write: (chunk, _, next) => {
        chunks.push(chunk);
        next();
      },
    });

    stream.once('error', (err) => reject(err));
    stream.once('close', () => resolve(Buffer.concat(chunks)));

    doc.pipe(stream);
    doc.end();
  });

  return buffer;
};
