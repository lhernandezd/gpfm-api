const { get, toUpper } = require('lodash');
const { genderStrings } = require('../defaults');

const patientData = (patient) => {
  const patientFirstName = get(patient, 'first_name', '--');
  const patientLastName = get(patient, 'last_name', '--');
  const patientFullName = `${patientLastName} ${patientFirstName}`;
  const patientDocumentType = get(patient, 'document_type', '--');
  const patientDocument = get(patient, 'document', '--');
  const patientIdentification = `${toUpper(patientDocumentType)} ${patientDocument}`;
  const patientAddress = get(patient, 'address', '--');
  const patientBirthDate = get(patient, 'birth_date', '--');
  const patientAgreement = get(patient, 'agreement.name', '--');
  const patientPhoneNumber = get(patient, 'phone_number', '--');
  const patientGender = genderStrings[get(patient, 'gender', '--')];

  return {
    patientFirstName,
    patientLastName,
    patientFullName,
    patientDocumentType,
    patientDocument,
    patientIdentification,
    patientAddress,
    patientBirthDate,
    patientAgreement,
    patientPhoneNumber,
    patientGender,
  };
};

module.exports = {
  patientData,
};
