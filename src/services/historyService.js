/* eslint-disable camelcase */
const { v4: uuidv4 } = require('uuid');
const validator = require('validator');
const omit = require('lodash/omit');
const paginate = require('../utils/paginate');
const searchQuery = require('../utils/searchQuery');
const db = require('../models');

const Patient = db.patient;
const History = db.history;
const City = db.city;
const State = db.state;
const Code = db.code;
const Agreement = db.agreement;
const Contact = db.contact;
const { Op } = db.Sequelize;

async function getHistory(id) {
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
            include: [
              {
                model: City,
                include: [State],
              },
              {
                model: Agreement,
              },
            ],
          },
        ],
      });
      if (history) {
        return history;
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

async function getAllHistories(queryParams) {
  const {
    page = 0, pageSize = 10, search = {},
  } = queryParams;
  const searchArray = searchQuery(search);
  try {
    const { rows, count } = await History.findAndCountAll({
      where: {
        ...searchArray,
      },
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
      order: [['created_at', 'DESC']],
    });
    const pages = Math.ceil(count / pageSize);
    return {
      data: rows,
      success: true,
      statusCode: '200',
      meta: {
        page: parseInt(page, 10) + 1,
        pageSize: parseInt(pageSize, 10),
        pages,
      },
    };
  } catch (error) {
    throw new Error(error);
  }
}

async function updateHistory(history, historyData, userId) {
  const desiredHistoryData = omit(historyData, ['code_id', 'remove_codes']);
  try {
    const result = await db.sequelize.transaction(async (t) => {
      const historyUpdated = await history.update({
        ...desiredHistoryData,
        updated_by_id: userId,
      });
      if (historyData.patient_id) {
        const patientFound = await Patient.findOne({
          where: {
            id: historyData.patient_id,
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
        }, { transaction: t });

        await historyUpdated.setPatient(patientFound);

        // Check if patient info needs to be updated
        if (historyData.updatePatientInfoField) {
          const desiredPatientValues = omit(patientFound.dataValues, ['id', 'iid', 'status', 'created_by_id', 'updated_by_id', 'created_at', 'updated_at']);
          await history.update({
            patient_info_save: desiredPatientValues,
          });
        }
      }
      if (historyData.agreement_id) {
        const agreementFound = await Agreement.findOne({
          where: {
            id: historyData.agreement_id,
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

    return reloadResult;
  } catch (error) {
    throw new Error(error);
  }
}

// eslint-disable-next-line consistent-return
async function createHistory(historyData, userId) {
  try {
    if (historyData.patient_id && historyData.agreement_id && historyData.code_id) {
      const history = await History.create({
        id: uuidv4(),
        ...historyData,
        created_by_id: userId,
        updated_by_id: userId,
      });
      await Patient.findOne({
        where: {
          id: historyData.patient_id,
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
      }).then((patient) => {
        history.setPatient(patient);
        const desiredPatientValues = omit(patient.dataValues, ['id', 'iid', 'status', 'created_by_id', 'updated_by_id', 'created_at', 'updated_at']);
        history.update({
          patient_info_save: desiredPatientValues,
        });
      });
      await Agreement.findOne({
        where: {
          id: historyData.agreement_id,
        },
      }).then((agreement) => {
        history.setAgreement(agreement);
      });
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
  } catch (error) {
    throw new Error({
      statusCode: '404',
      message: error.message,
    });
  }
}

module.exports = {
  getHistory,
  getAllHistories,
  updateHistory,
  createHistory,
};
