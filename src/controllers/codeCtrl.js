const validator = require('validator');

const paginate = require('../utils/paginate');
const db = require('../models');

const Code = db.code;

exports.id = async (req, res, next, id) => {
  try {
    if (validator.isUUID(id)) {
      const code = await Code.findOne({
        where: {
          id,
        },
      });
      if (code) {
        req.code = code;
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
  const { page = 0, pageSize = 100 } = req.query;
  try {
    const { rows, count } = await Code.findAndCountAll({
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
  const { code = {} } = req;
  if (code) {
    res.json({
      data: code,
      success: true,
      statusCode: '200',
    });
  }
};
