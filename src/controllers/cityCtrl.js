const validator = require('validator');

const paginate = require('../utils/paginate');
const db = require('../models');

const City = db.city;

exports.id = async (req, res, next, id) => {
  try {
    if (validator.isUUID(id)) {
      const city = await City.findOne({
        where: {
          id,
        },
      });
      if (city) {
        req.city = city;
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
    const { rows, count } = await City.findAndCountAll({
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
  const { city = {} } = req;
  if (city) {
    res.json({
      data: city,
      success: true,
      statusCode: '200',
    });
  }
};
