/* eslint-disable camelcase */
const { v4: uuidv4 } = require('uuid');

const paginate = require('../utils/paginate');
const db = require('../models');

const Patient = db.patient;
const City = db.city;

exports.all = async (req, res, next) => {
  const { page = 0, pageSize = 10 } = req.query;
  try {
    const { rows, count } = await Patient.findAndCountAll({
      where: {},
      ...paginate({ page, pageSize }),
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
  const { id } = req.query;
  try {
    const patient = await Patient.find({
      where: {
        id: {
          '=': id,
        },
      },
    });
    res.json({
      data: patient,
      success: true,
      statusCode: '200',
    });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  const { id } = req.query;
  try {
    const patient = await Patient.find({
      where: {
        id: {
          '=': id,
        },
      },
    });
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
  const { id } = req.query;
  const { ...patientData } = req.body;
  try {
    const patient = await Patient.find({
      where: { id },
    });
    const patientUpdated = await patient.update({
      ...patientData,
      updated_by_id: req.userId,
    });
    res.json({
      data: patientUpdated,
      success: true,
      statusCode: '200',
    });
  } catch (error) {
    next(error);
  }
};

exports.create = (req, res, next) => {
  // Save User to Database
  const { ...patientData } = req.body;
  Patient.create({
    id: uuidv4(),
    ...patientData,
    created_by_id: req.userId,
    updated_by_id: req.userId,
  })
    .then((user) => {
      if (req.body.city_id) {
        City.findOne({
          where: {
            id: req.body.city_id,
          },
        }).then((city) => {
          user.setCity(city);
        });
      }
    })
    .then(() => {
      res.send({ message: 'Patient was registered successfully!' });
    })
    .catch((err) => {
      next({
        statusCode: '404',
        message: err.message,
      });
    });
};
