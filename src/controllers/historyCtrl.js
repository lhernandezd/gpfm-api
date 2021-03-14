/* eslint-disable camelcase */
const { v4: uuidv4 } = require('uuid');
const validator = require('validator');
const omit = require('lodash/omit');
const paginate = require('../utils/paginate');
const db = require('../models');

const Patient = db.patient;
const History = db.history;
const City = db.city;
const State = db.state;
const Code = db.code;
const Agreement = db.agreement;
const { Op } = db.Sequelize;

exports.id = async (req, res, next, id) => {
  try {
    if (validator.isUUID(id)) {
      const history = await History.findOne({
        where: {
          id,
        },
        include: [
          {
            model: Code,
          },
          {
            model: Patient,
            include: {
              model: City,
              include: [State],
            },
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
      include: [
        {
          model: Patient,
          include: [{
            model: City,
            include: [State],
          }],
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
  const desiredHistoryData = omit(historyData, ['code_id', 'remove_codes']);
  try {
    const historyUpdated = await history.update({
      ...desiredHistoryData,
      updated_by_id: req.userId,
    });
    if (historyData.code_id) {
      await Code.findAll({
        where: {
          id: {
            [Op.or]: historyData.code_id,
          },
        },
      }).then((codes) => {
        history.setCodes(codes);
      });
    }
    if (historyData.remove_codes) {
      await Code.findAll({
        where: {
          id: {
            [Op.or]: historyData.remove_codes,
          },
        },
      }).then((dbCodes) => {
        if (dbCodes.length < 2) {
          next({
            statusCode: '400',
            message: 'Action imposible',
          });
        } else {
          history.removeCodes(dbCodes);
        }
      });
    }
    const historyQuery = await History.findOne({
      where: {
        id: historyUpdated.id,
      },
      include: [
        {
          model: Code,
        },
        {
          model: Patient,
          include: {
            model: City,
            include: [State],
          },
        },
      ],
    });
    res.json({
      data: historyQuery,
      success: true,
      statusCode: '200',
    });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  // Save History to Database
  const { ...historyData } = req.body;
  try {
    const history = await History.create({
      id: uuidv4(),
      ...historyData,
      created_by_id: req.userId,
      updated_by_id: req.userId,
    });
    if (req.body.patient_id) {
      await Patient.findOne({
        where: {
          id: req.body.patient_id,
        },
      }).then((patient) => {
        history.setPatient(patient);
      });
    }
    if (req.body.code_id) {
      await Code.findAll({
        where: {
          id: {
            [Op.or]: req.body.code_id,
          },
        },
      }).then((codes) => {
        history.setCodes(codes).then(() => {
          res.send({ message: 'History was registered successfully!' });
        });
      });
    } else {
      throw new Error('History codes required');
    }
    if (req.body.agreement_id) {
      await Agreement.findOne({
        where: {
          id: req.body.agreement_id,
        },
      }).then((agreement) => {
        history.setAgreement(agreement);
      });
    }
  } catch (error) {
    next({
      statusCode: '404',
      message: error.message,
    });
  }
};
