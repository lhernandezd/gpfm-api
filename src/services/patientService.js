/* eslint-disable camelcase */
const validator = require('validator');
const db = require('../models');

const Patient = db.patient;
const City = db.city;
const State = db.state;
const Agreement = db.agreement;
const Contact = db.contact;

async function getPatient(id) {
  try {
    if (validator.isUUID(id)) {
      const patient = await Patient.findOne({
        where: {
          id,
        },
        include: [
          {
            model: City,
            include: [State],
          },
          {
            model: Agreement,
          },
          {
            model: Contact,
          },
        ],
      });
      if (patient) {
        return patient;
      }
      throw new Error({
        statusCode: '404',
        message: 'Resource not found',
      });
    } else {
      throw new Error({
        statusCode: '404',
        message: 'Resource not found',
      });
    }
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = {
  getPatient,
};
