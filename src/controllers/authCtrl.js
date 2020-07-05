const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const db = require('../models');
const config = require('../../config');

const User = db.user;
const City = db.city;
const Role = db.role;

const { Op } = db.Sequelize;

exports.signup = (req, res, next) => {
  // Save User to Database
  User.create({
    id: uuidv4(),
    ...req.body,
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  })
    .then((user) => {
      if (req.body.city_id) {
        City.findOne({
          where: {
            id: req.body.city_id,
          },
        }).then((city) => {
          user.setCity(city);
        });
      }
      if (req.body.roles) {
        Role.findAll({
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
        return res.status(404).send({ message: 'User role required' });
      }
    })
    .catch((err) => {
      next({
        statusCode: '404',
        message: err.message,
      });
    });
};

exports.signin = (req, res, next) => {
  User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'User Not found.' });
      }

      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password,
      );

      if (!passwordIsValid) {
        next({
          statusCode: '404',
          message: 'Invalid Credentials',
          accessToken: null,
        });
      }

      const token = jwt.sign({ id: user.id }, config.token.secret, {
        expiresIn: 86400, // 24 hours
      });

      const authorities = [];
      user.getRoles().then((roles) => {
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < roles.length; i++) {
          authorities.push(roles[i].name);
        }
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          phone_number: user.phone_number,
          address: user.address,
          roles: authorities,
          accessToken: token,
        });
      });
    })
    .catch((err) => {
      next({
        statusCode: '404',
        message: err.message,
      });
    });
};

exports.signintoken = (req, res, next) => {
  User.findOne({
    where: {
      id: req.userId,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'User Not found.' });
      }

      const authorities = [];
      user.getRoles().then((roles) => {
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < roles.length; i++) {
          authorities.push(roles[i].name);
        }
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities,
        });
      });
    })
    .catch((err) => {
      next({
        statusCode: '404',
        message: err.message,
      });
    });
};
