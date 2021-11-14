/* eslint-disable camelcase */
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const paginate = require('../utils/paginate');
const db = require('../models');

const User = db.user;
const Role = db.role;
const City = db.city;
const State = db.state;
const { Op } = db.Sequelize;

exports.id = async (req, res, next, id) => {
  try {
    if (validator.isUUID(id)) {
      const user = await User.findOne({
        where: {
          id,
        },
        include: [
          {
            model: Role,
          },
          {
            model: City,
            include: [State],
          },
        ],
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
      include: [
        {
          model: Role,
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

exports.update = async (req, res, next) => {
  const { user = {} } = req;
  const {
    username, address, phone_number, roles, remove_roles, status,
  } = req.body;
  try {
    const userData = await user.update({
      username,
      address,
      phone_number,
      status,
      updated_by_id: req.userId,
    });
    if (roles) {
      await Role.findAll({
        where: {
          name: {
            [Op.or]: roles,
          },
        },
      }).then((dbRoles) => {
        user.setRoles(dbRoles);
      });
    }
    if (remove_roles) {
      await Role.findAll({
        where: {
          name: {
            [Op.or]: remove_roles,
          },
        },
      }).then((dbRoles) => {
        if (dbRoles.length < 2) {
          next({
            statusCode: '400',
            message: 'Action imposible',
          });
        } else {
          user.removeRoles(dbRoles);
        }
      });
    }
    res.json({
      data: userData,
      success: true,
      statusCode: '200',
    });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  // Save User to Database
  try {
    const user = await User.create({
      id: uuidv4(),
      ...req.body,
      username: req.body.username,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8),
      status: 'active',
      created_by_id: req.userId,
      updated_by_id: req.userId,
    });
    if (req.body.city_id) {
      await City.findOne({
        where: {
          id: req.body.city_id,
        },
      }).then((city) => {
        user.setCity(city);
      });
    }
    if (req.body.roles) {
      await Role.findAll({
        where: {
          name: {
            [Op.or]: req.body.roles,
          },
        },
      }).then((roles) => {
        user.setRoles(roles).then(() => {
          res.send({ message: 'User was registered successfully!' });
        });
      });
    } else {
      await user.destroy();
      throw new Error('User role required');
    }
  } catch (error) {
    next({
      statusCode: '404',
      message: error.message,
    });
  }
};
