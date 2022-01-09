const path = require('path');

const fromEmail = process.env.SENDGRID_EMAIL;

const pdfTemplateA = {
  pageMargins: [40, 70, 40, 60],
  defaultStyle: {
    fontSize: 11,
  },
  footer: {
    stack: [
      {
        columns: [
          { text: [{ text: 'Teléfono: ', bold: true }, '300 8469579'], alignment: 'center' },
          { text: [{ text: 'Email: ', bold: true }, fromEmail], alignment: 'center' },
          { text: [{ text: 'Ciudad: ', bold: true }, 'Barranquilla'], alignment: 'center' },
        ],
        style: 'smallBottomMargin',
      },
      {
        text: [
          {
            text: 'Dirección: ',
            bold: true,
          },
          'Carrera 44 No. 72 - 131 Consultorio 308 Clínica de Diagnostico',
        ],
        alignment: 'center',
      },
    ],
  },
  styles: {
    header: {
      fontSize: 18,
      bold: true,
      height: 300,
    },
    subheader: {
      fontSize: 15,
      bold: true,
    },
    quote: {
      italics: true,
    },
    paragraph: {
      margin: [0, 2, 0, 5],
    },
    subtitle: {
      decoration: 'underline',
      bold: true,
    },
    fontSmall: {
      fontSize: 8,
    },
    fontMedium: {
      fontSize: 12,
    },
    font20: {
      fontSize: 20,
    },
    smallBottomMargin: {
      margin: [0, 0, 0, 5],
    },
    bottomMargin15: {
      margin: [0, 0, 0, 15],
    },
  },
  images: {
    test: path.join(__dirname, '..', 'src', '/static/images/logo.png'),
  },
};

const genderStrings = {
  male: 'Masculino',
  female: 'Femenino',
  no_binary: 'Sin Definir',
};

module.exports = {
  pdfTemplateA,
  genderStrings,
};
