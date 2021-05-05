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
    const result = await db.sequelize.transaction(async (t) => {
      const historyUpdated = await history.update({
        ...desiredHistoryData,
        updated_by_id: req.userId,
      });
      if (req.body.patient_id) {
        const patientFound = await Patient.findOne({
          where: {
            id: req.body.patient_id,
          },
        }, { transaction: t });
        await historyUpdated.setPatient(patientFound);
      }
      if (req.body.agreement_id) {
        const agreementFound = await Agreement.findOne({
          where: {
            id: req.body.agreement_id,
          },
        }, { transaction: t });
        await historyUpdated.setAgreement(agreementFound);
      }
      if (historyData.code_id) {
        const codesFound = await Code.findAll({
          where: {
            id: {
              [Op.or]: historyData.code_id,
            },
          },
        }, { transaction: t });
        await historyUpdated.setCodes(codesFound);
      }
      if (historyData.remove_codes) {
        const removeCodesFound = await Code.findAll({
          where: {
            id: {
              [Op.or]: historyData.remove_codes,
            },
          },
        }, { transaction: t });
        await historyUpdated.removeCodes(removeCodesFound);
      }

      return historyUpdated;
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
  // Save History to Database
  const { ...historyData } = req.body;
  try {
    if (req.body.patient_id && req.body.agreement_id && req.body.code_id) {
      const history = await History.create({
        id: uuidv4(),
        ...historyData,
        created_by_id: req.userId,
        updated_by_id: req.userId,
      });
      await Patient.findOne({
        where: {
          id: req.body.patient_id,
        },
      }).then((patient) => {
        history.setPatient(patient);
      });
      await Agreement.findOne({
        where: {
          id: req.body.agreement_id,
        },
      }).then((agreement) => {
        history.setAgreement(agreement);
      });
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
      const errorMessage = 'History required fields';
      const errorArray = [];
      if (!req.body.patient_id) errorArray.push('Patient');
      if (!req.body.agreement_id) errorArray.push('Agreement');
      if (!req.body.code_id) errorArray.push('CIE Code');
      next({
        statusCode: '400',
        message: `${errorMessage}: ${errorArray.join(', ')}`,
      });
    }
  } catch (error) {
    next({
      statusCode: '404',
      message: error.message,
    });
  }
};
