/* eslint-disable camelcase */
const { v4: uuidv4 } = require('uuid');
const validator = require('validator');
const paginate = require('../utils/paginate');
const db = require('../models');

const Entity = db.entity;
const Agreement = db.agreement;

exports.id = async (req, res, next, id) => {
  try {
    if (validator.isUUID(id)) {
      const entity = await Entity.findOne({
        where: {
          id,
        },
        include: [
          { model: Agreement },
        ],
      });
      if (entity) {
        req.entity = entity;
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
    const { rows, count } = await Entity.findAndCountAll({
      where: {},
      ...paginate({ page, pageSize }),
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
  const { entity = {} } = req;
  if (entity) {
    res.json({
      data: entity,
      success: true,
      statusCode: '200',
    });
  }
};

exports.create = async (req, res, next) => {
  // Save Entity to Database
  try {
    await Entity.create({
      id: uuidv4(),
      ...req.body,
      name: req.body.name,
      nit: req.body.nit,
      created_by_id: req.userId,
      updated_by_id: req.userId,
    });
    res.send({ message: 'Entity was registered successfully!' });
  } catch (error) {
    next({
      statusCode: '404',
      message: error.message,
    });
  }
};
