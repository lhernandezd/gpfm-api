/* eslint-disable camelcase */
const { v4: uuidv4 } = require('uuid');
const validator = require('validator');
const omit = require('lodash/omit');
const paginate = require('../utils/paginate');
const orderQuery = require('../utils/orderQuery');
const searchQuery = require('../utils/searchQuery');
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
  const {
    page = 0, pageSize = 10, order = {}, search = {},
  } = req.query;
  try {
    const orderArray = orderQuery(order);
    const searchArray = searchQuery(search);
    const { rows, count } = await Patient.findAndCountAll({
      where: {
        ...searchArray,
      },
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
      order: orderArray,
    });
    const pages = Math.ceil(count / pageSize);
    res.json({
      data: rows,
      success: true,
      statusCode: '200',
      meta: {
        page: parseInt(page, 10) + 1,
        pageSize: parseInt(pageSize, 10),
        pages,
        order: orderArray,
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
    const result = await db.sequelize.transaction(async (t) => {
      if (req.body.contacts) {
        req.body.contacts.forEach(async (contact) => {
          if (contact.id) {
            const existContact = await Contact.findOne({
              where: {
                id: contact.id,
              },
            }, { transaction: t });
            await existContact.update({
              ...omit(contact, ['created_at', 'updated_at', 'id', 'iid']),
              updated_by_id: req.userId,
            });
          } else {
            await Contact.create({
              id: uuidv4(),
              ...contact,
              patient_id: patient.id,
              created_by_id: req.userId,
              updated_by_id: req.userId,
            }, { transaction: t });
          }
        });
      }
      if (req.body.remove_contacts) {
        req.body.remove_contacts.forEach(async (contact) => {
          const removeContactsFound = await Contact.findOne({
            where: {
              id: contact.id,
            },
          }, { transaction: t });
          await removeContactsFound.destroy({ transaction: t });
        });
      }
      const patientUpdated = await patient.update({
        ...patientData,
        updated_by_id: req.userId,
      });
      if (req.body.city_id) {
        const cityFound = await City.findOne({
          where: {
            id: req.body.city_id,
          },
        }, { transaction: t });
        await patientUpdated.setCity(cityFound);
      }
      if (req.body.agreement_id) {
        const agreementFound = await Agreement.findOne({
          where: {
            id: req.body.agreement_id,
          },
        }, { transaction: t });
        await patientUpdated.setAgreement(agreementFound);
      }

      return patientUpdated;
    });

    const reloadResult = await result.reload();

    res.json({
      data: reloadResult,
      success: true,
      statusCode: '200',
    });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  // Save patient to Database
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
