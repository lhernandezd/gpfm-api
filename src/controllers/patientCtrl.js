/* eslint-disable camelcase */
const { v4: uuidv4 } = require('uuid');
const validator = require('validator');
const paginate = require('../utils/paginate');
const db = require('../models');

const Patient = db.patient;
const City = db.city;
const State = db.state;
const Agreement = db.agreement;
const Contact = db.contact;

exports.id = async (req, res, next, id) => {
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
        req.patient = patient;
        next();
      } else {
        next({
          statusCode: '404',
          message: 'Resource not found',
        });
      }
    } else {
      next({
        statusCode: '404',
        message: 'Resource not found',
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.all = async (req, res, next) => {
  const { page = 0, pageSize = 10 } = req.query;
  try {
    const { rows, count } = await Patient.findAndCountAll({
      where: {},
      ...paginate({ page, pageSize }),
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
    const pages = Math.ceil(count / pageSize);
    res.json({
      data: rows,
      success: true,
      statusCode: '200',
      meta: {
        page: page + 1,
        pageSize,
        pages,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.read = async (req, res, next) => {
  const { patient = {} } = req;
  if (patient) {
    res.json({
      data: patient,
      success: true,
      statusCode: '200',
    });
  }
};

exports.delete = async (req, res, next) => {
  const { patient = {} } = req;
  try {
    const deleted = patient.destroy();
    res.json({
      data: deleted,
      success: true,
      statusCode: '200',
    });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  const { patient = {} } = req;
  const { ...patientData } = req.body;
  try {
    const patientUpdated = await patient.update({
      ...patientData,
      updated_by_id: req.userId,
    });
    if (req.body.city_id) {
      await City.findOne({
        where: {
          id: req.body.city_id,
        },
      }).then((city) => {
        patient.setCity(city);
      });
    }
    if (req.body.agreement_id) {
      await Agreement.findOne({
        where: {
          id: req.body.agreement_id,
        },
      }).then((agreement) => {
        patient.setAgreement(agreement);
      });
    }
    const patientQuery = await Agreement.findOne({
      where: {
        id: patientUpdated.id,
      },
      include: [
        {
          model: City,
          include: [State],
        },
        {
          model: Agreement,
        },
      ],
    });
    res.json({
      data: patientQuery,
      success: true,
      statusCode: '200',
    });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  // Save User to Database
  const { ...patientData } = req.body;
  try {
    if (req.body.city_id && req.body.agreement_id) {
      const patient = await Patient.create({
        id: uuidv4(),
        ...patientData,
        created_by_id: req.userId,
        updated_by_id: req.userId,
      });
      await City.findOne({
        where: {
          id: req.body.city_id,
        },
      }).then((city) => {
        patient.setCity(city);
      });
      await Agreement.findOne({
        where: {
          id: req.body.agreement_id,
        },
      }).then((agreement) => {
        patient.setAgreement(agreement).then(() => {
          if (req.body.contacts) {
            req.body.contacts.forEach(async (contact) => {
              await Contact.create({
                id: uuidv4(),
                ...contact,
                patient_id: patient.id,
                created_by_id: req.userId,
                updated_by_id: req.userId,
              });
            });
          }
          res.send({ message: 'Patient was registered successfully!' });
        });
      });
    } else {
      const errorMessage = 'Patient required fields';
      const errorArray = [];
      if (!req.body.city_id) errorArray.push('City');
      if (!req.body.agreement_id) errorArray.push('Agreement');
      throw new Error(`${errorMessage}: ${errorArray.join(', ')}`);
    }
  } catch (error) {
    next({
      statusCode: '404',
      message: error.message,
    });
  }
};
