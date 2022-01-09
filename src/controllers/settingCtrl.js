const validator = require('validator');

const paginate = require('../utils/paginate');
const db = require('../models');

const Setting = db.setting;

exports.id = async (req, res, next, id) => {
  try {
    if (validator.isUUID(id)) {
      const setting = await Setting.findOne({
        where: {
          id,
        },
      });
      if (setting) {
        req.setting = setting;
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
    const { rows, count } = await Setting.findAndCountAll({
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

exports.read = (req, res) => {
  const { setting = {} } = req;
  if (setting) {
    res.json({
      data: setting,
      success: true,
      statusCode: '200',
    });
  }
};
