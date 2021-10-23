/* eslint-disable camelcase */
const PdfPrinter = require('pdfmake');
const path = require('path');
const { format } = require('date-fns');
const startCase = require('lodash/startCase');
const { defaultHistoryPDFDefinition } = require('../defaults');
const { patientData } = require('../utils/pdfDataManipulation');

async function createPdfBinary(pdfDocDef, fileName, cllbk) {
  try {
    const fontDescriptors = {
      Roboto: {
        normal: path.join(__dirname, '..', 'static', '/fonts/Roboto-Regular.ttf'),
        bold: path.join(__dirname, '..', 'static', '/fonts/Roboto-Medium.ttf'),
        italics: path.join(__dirname, '..', 'static', '/fonts/Roboto-Italic.ttf'),
        bolditalics: path.join(__dirname, '..', 'static', '/fonts/Roboto-MediumItalic.ttf'),
      },
    };

    const printer = new PdfPrinter(fontDescriptors);

    const doc = printer.createPdfKitDocument(pdfDocDef);

    const chunks = [];
    let result;

    doc.on('data', (chunk) => {
      chunks.push(chunk);
    });
    doc.on('end', () => {
      result = Buffer.concat(chunks);
      cllbk(fileName, `data:application/pdf;base64,${result.toString('base64')}`);
    });
    doc.end();
  } catch (error) {
    throw new Error(error);
  }
}

function createHistoryPDF(history, cllbk) {
  const {
    iid, weight, height, imc, heart_rate, blood_pressure,
    breath_frequency, temperature, medical_evolution,
    background, medicine, exam_performed, reason, physical_exam,
    treatment_plan, medical_formula, consent,
    updated_at, codes, patient_info_save, patient,
  } = history.dataValues;

  const patientObjectData = patientData(patient);
  const patientOnSave = patientData(patient_info_save);
  const {
    patientFullName, patientBirthDate, patientGender,
    patientLastName, patientFirstName,
  } = patientObjectData;

  const {
    patientIdentification: patientIdentificationOnSave, patientAddress: patientAddressOnSave,
    patientPhoneNumber: patientPhoneNumberOnSave, patientAgreement: patientAgreementOnSave,
  } = patientOnSave;

  const cieCodes = codes.map((code) => `${code.code} - ${code.description}`).join(', ');

  const docName = `Historia_${iid}_${patientLastName}_${patientFirstName}`;

  const customHeader = {
    margin: [40, 10, 40, 0],
    columns: [
      { image: 'test', fit: [100, 60], alignment: 'left' },
      {
        stack: [
          { text: [{ text: 'Nro. Historia Clínica: ', bold: true }, `${iid}`], alignment: 'right', style: 'smallBottomMargin' },
          { text: '1140881605', alignment: 'right', style: 'font20' },
        ],
        alignment: 'left',
      },
    ],
  };

  const content = [
    {
      stack: [
        {
          text: 'Historia Clínica', style: ['header', 'smallBottomMargin'], alignment: 'center',
        },
        {
          text: [
            { text: 'Fecha: ', bold: true },
            format(updated_at, 'dd/MM/yyyy'),
          ],
          alignment: 'center',
        },
      ],
      style: 'bottomMargin15',
    },
    {
      text: 'Información Básica',
      style: ['subheader', 'smallBottomMargin'],
    },
    {
      stack: [
        {
          columns: [
            {
              text: [
                { text: 'Paciente: ', bold: true },
                `${startCase(patientFullName)}`,
              ],
              alignment: 'left',
            },
            {
              text: [
                { text: 'Identificación: ', bold: true },
                `${patientIdentificationOnSave}`,
              ],
              alignment: 'right',
            },
          ],
          style: 'smallBottomMargin',
        },
        {
          columns: [
            {
              text: [
                { text: 'Dirección: ', bold: true },
                `${patientAddressOnSave}`,
              ],
              alignment: 'left',
            },
            {
              text: [
                { text: 'Fecha de Nacimiento: ', bold: true },
                format(patientBirthDate, 'dd/MM/yyyy'),
              ],
              alignment: 'right',
            },
          ],
          style: 'smallBottomMargin',
        },
        {
          columns: [
            {
              text: [
                { text: 'Convenio: ', bold: true },
                `${patientAgreementOnSave}`,
              ],
              alignment: 'left',
            },
            {
              text: [
                { text: 'Teléfono: ', bold: true },
                `${patientPhoneNumberOnSave}`,
              ],
              alignment: 'right',
            },
          ],
          style: 'smallBottomMargin',
        },
        {
          text: [
            { text: 'Sexo: ', bold: true },
            `${patientGender}`,
          ],
          alignment: 'left',
        },
      ],
      style: 'bottomMargin15',
    },
    {
      text: 'Detalles',
      style: ['subheader', 'smallBottomMargin'],
    },
    {
      columns: [
        {
          text: [
            { text: 'Peso: ', bold: true },
            `${weight}`,
            'kg',
          ],
          width: '14%',
        },
        {
          text: [
            { text: 'Altura: ', bold: true },
            `${height}`,
            'mt',
          ],
          width: '15%',
        },
        {
          text: [
            { text: 'IMC: ', bold: true },
            `${imc}`,
          ],
          width: '14%',
        },
        {
          text: [
            { text: 'FC: ', bold: true },
            `${heart_rate}`,
          ],
          width: '14%',
        },
        {
          text: [
            { text: 'PA: ', bold: true },
            `${blood_pressure}`,
          ],
          width: '14%',
        },
        {
          text: [
            { text: 'FR: ', bold: true },
            `${breath_frequency}`,
          ],
          width: '14%',
        },
        {
          text: [
            { text: 'T: ', bold: true },
            `${temperature}`,
          ],
          width: '14%',
        },
      ],
      style: 'smallBottomMargin',
    },
    {
      text: 'Impresión Diagnostica (CIE-10)',
      style: 'subtitle',
    },
    {
      text: `${cieCodes}`,
      style: 'paragraph',
    },
    {
      text: 'Evolucion Medica',
      style: 'subtitle',
    },
    {
      text: `${medical_evolution}`,
      style: 'paragraph',
    },
    {
      text: 'Antecedentes',
      style: 'subtitle',
    },
    {
      text: `${background}`,
      style: 'paragraph',
    },
    {
      text: 'Medicamentos',
      style: 'subtitle',
    },
    {
      text: `${medicine}`,
      style: 'paragraph',
    },
    {
      text: 'Exámenes Realizados',
      style: 'subtitle',
    },
    {
      text: `${exam_performed}`,
      style: 'paragraph',
    },
    {
      text: 'Motivo de la consulta',
      style: 'subtitle',
    },
    {
      text: `${reason}`,
      style: 'paragraph',
    },
    {
      text: 'Examen Físico',
      style: 'subtitle',
    },
    {
      text: `${physical_exam}`,
      style: 'paragraph',
    },
    {
      text: 'Plan de Tratamiento',
      style: 'subtitle',
    },
    {
      text: `${treatment_plan}`,
      style: 'paragraph',
    },
    {
      text: 'Formula Medica',
      style: 'subtitle',
    },
    {
      text: `${medical_formula}`,
      style: 'paragraph',
    },
    {
      text: 'Consentimiento Informado',
      style: 'subtitle',
    },
    {
      text: `${consent}`,
      style: 'paragraph',
    },
  ];

  const docDefinition = {
    ...defaultHistoryPDFDefinition,
    header: customHeader,
    content,

  };

  return createPdfBinary(docDefinition, docName, cllbk);
}

module.exports = {
  createHistoryPDF,
};
