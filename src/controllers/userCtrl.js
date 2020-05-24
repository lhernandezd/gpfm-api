const validator = require('validator');

const paginate = require('../utils/paginate');
const db = require('../models');

const User = db.user;

exports.id = async (req, res, next, id) => {
  try {
    if (validator.isUUID(id)) {
      const user = await User.findOne({
        where: {
          id,
        },
      });
      if (user) {
        req.user = user;
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
    const { rows, count } = await User.findAndCountAll({
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
  const { user = {} } = req;
  if (user) {
    res.json({
      data: user,
      success: true,
      statusCode: '200',
    });
  }
};

exports.delete = async (req, res, next) => {
  const { user = {} } = req;
  try {
    const deleted = user.destroy();
    res.json({
      data: deleted,
      success: true,
      statusCode: '200',
    });
  } catch (error) {
    next(error);
  }
};
