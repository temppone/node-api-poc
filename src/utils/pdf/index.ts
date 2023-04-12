import { FastifyReply } from 'fastify';
import PDFDocument from 'pdfkit';
import { Writable } from 'stream';
import { IContractData } from '../../@types/generateContaract';

export const createContractPDF = async (
  response: FastifyReply,
  contractRequestData: IContractData,
  headerText?: string,
  contentText?: string
) => {
  const { personalCustomerData, personalProviderData, projectDuration, projectValue, observation } =
    contractRequestData;

  const numberAndDotRegex = /(\d+\. )/g;

  const doc = new PDFDocument({ margin: 40 });

  doc.info.Title = 'Contrato de prestação de serviço';

  doc.fillColor('black').fontSize(18).text('Contrato de prestação de serviço', 0, 20, {
    align: 'center',
  });

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

  const textValues: { [key: string]: string } = {
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
    PROJECTVALUE: projectValue,
    PROJECTDURATION: projectDuration,
    OBSERVATION: observation || '',
    PROVIDERCITY: providerCity,
    PROVIDERSTATE: providerState,
  };

  const newHeaderText = Object.keys(textValues).reduce((actualText: string, key) => {
    if (actualText.includes(key)) {
      return actualText.replace(`[${key}]`, textValues[key]);
    }

    return actualText;
  }, headerText || '');

  const newContentText = Object.keys(textValues).reduce((actualText: string, key) => {
    if (actualText.includes(key)) {
      return actualText.replace(`[${key}]`, textValues[key]).replace(numberAndDotRegex, '\n$&');
    }

    return actualText;
  }, contentText || '');

  doc.fontSize(10).text(newHeaderText || '', 50, 50, { align: 'justify', width: 500 });
  doc.fontSize(10).text(newContentText || '', 50, 130, { align: 'justify', width: 500 });

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
