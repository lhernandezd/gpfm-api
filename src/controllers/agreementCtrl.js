/* eslint-disable camelcase */
const { v4: uuidv4 } = require('uuid');
const validator = require('validator');
const paginate = require('../utils/paginate');
const db = require('../models');

const Patient = db.patient;
const City = db.city;
const State = db.state;
const Agreement = db.agreement;
const Entity = db.entity;

exports.id = async (req, res, next, id) => {
  try {
    if (validator.isUUID(id)) {
      const agreement = await Agreement.findOne({
        where: {
          id,
        },
        include: [
          {
            model: Patient,
            include: [{
              model: City,
              include: [State],
            }],
          },
          {
            model: Entity,
          },
        ],
      });
      if (agreement) {
        req.agreement = agreement;
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
    const { rows, count } = await Agreement.findAndCountAll({
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
        {
          model: Entity,
        },
      ],
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
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.read = async (req, res, next) => {
  const { agreement = {} } = req;
  if (agreement) {
    res.json({
      data: agreement,
      success: true,
      statusCode: '200',
    });
  }
};

exports.delete = async (req, res, next) => {
  const { agreement = {} } = req;
  try {
    const deleted = agreement.destroy();
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
  const { agreement = {} } = req;
  const { ...agreementData } = req.body;
  try {
    const agreementUpdated = await agreement.update({
      ...agreementData,
      updated_by_id: req.userId,
    });
    if (req.body.entity_id) {
      await Entity.findOne({
        where: {
          id: req.body.entity_id,
        },
      }).then((entity) => {
        agreement.setEntity(entity);
      });
    }
    const agreementQuery = await Agreement.findOne({
      where: {
        id: agreementUpdated.id,
      },
      include: [
        {
          model: Entity,
        },
      ],
    });
    res.json({
      data: agreementQuery,
      success: true,
      statusCode: '200',
    });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  // Save Agreement to Database
  const { ...agreementData } = req.body;
  try {
    const agreement = await Agreement.create({
      id: uuidv4(),
      ...agreementData,
      created_by_id: req.userId,
      updated_by_id: req.userId,
    });
    if (req.body.entity_id) {
      await Entity.findOne({
        where: {
          id: req.body.entity_id,
        },
      }).then((entity) => {
        agreement.setEntity(entity).then(() => {
          res.send({ message: 'Agreement was registered successfully!' });
        });
      });
    } else {
      throw new Error('Entity required');
    }
  } catch (error) {
    next({
      statusCode: '404',
      message: error.message,
    });
  }
};
