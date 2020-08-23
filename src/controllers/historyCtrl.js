/* eslint-disable camelcase */
const { v4: uuidv4 } = require('uuid');
const validator = require('validator');
const paginate = require('../utils/paginate');
const db = require('../models');

const Patient = db.patient;
const History = db.history;
const City = db.city;
const State = db.state;

exports.id = async (req, res, next, id) => {
  try {
    if (validator.isUUID(id)) {
      const history = await History.findOne({
        where: {
          id,
        },
        include: [
          {
            model: Patient,
            include: [City, State],
          },
        ],
      });
      if (history) {
        req.history = history;
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
    const { rows, count } = await History.findAndCountAll({
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
  const { history = {} } = req;
  if (history) {
    res.json({
      data: history,
      success: true,
      statusCode: '200',
    });
  }
};

exports.delete = async (req, res, next) => {
  const { history = {} } = req;
  try {
    const deleted = history.destroy();
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
  const { history = {} } = req;
  const { ...historyData } = req.body;
  try {
    const historyUpdated = await history.update({
      ...historyData,
      updated_by_id: req.userId,
    });
    res.json({
      data: historyUpdated,
      success: true,
      statusCode: '200',
    });
  } catch (error) {
    next(error);
  }
};

exports.create = (req, res, next) => {
  // Save User to Database
  const { ...historyData } = req.body;
  History.create({
    id: uuidv4(),
    ...historyData,
    created_by_id: req.userId,
    updated_by_id: req.userId,
  })
    .then((history) => {
      if (req.body.patient_id) {
        Patient.findOne({
          where: {
            id: req.body.patient_id,
          },
        }).then((patient) => {
          history.setPatient(patient);
        });
      }
    })
    .then(() => {
      res.send({ message: 'History was registered successfully!' });
    })
    .catch((err) => {
      next({
        statusCode: '404',
        message: err.message,
      });
    });
};
