const validator = require('validator');

const paginate = require('../utils/paginate');
const db = require('../models');

const State = db.state;

exports.id = async (req, res, next, id) => {
  try {
    if (validator.isUUID(id)) {
      const state = await State.findOne({
        where: {
          id,
        },
      });
      if (state) {
        req.state = state;
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
    const { rows, count } = await State.findAndCountAll({
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

exports.read = (req, res) => {
  const { state = {} } = req;
  if (state) {
    res.json({
      data: state,
      success: true,
      statusCode: '200',
    });
  }
};
