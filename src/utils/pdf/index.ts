import PDFDocument from 'pdfkit';
import { IContractBody } from '../../@types/generateContaract';

export const createContractPDF = (contract: IContractBody, path: any) => {
  const doc = new PDFDocument({ margin: 40 });

  // generateHeader(doc);
  // generateContent(doc);
  // generateFooter(doc);

  doc.pipe(path);
};

export const generateHeader = () => {};
