const validator = require('validator');

const paginate = require('../utils/paginate');
const db = require('../models');

const City = db.city;
const State = db.state;

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
      include: [
        {
          model: State,
        },
      ],
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
