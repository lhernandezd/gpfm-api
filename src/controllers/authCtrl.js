const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const db = require('../models');
const config = require('../../config');
const { sendMail } = require('../utils/sendEmail');

const User = db.user;
const City = db.city;
const Role = db.role;

const { Op } = db.Sequelize;

exports.signup = async (req, res, next) => {
  const { ...userData } = req.body;
  // Save User to Database
  try {
    const userId = uuidv4();
    const user = await User.create({
      id: userId,
      ...userData,
      password: bcrypt.hashSync(userData.password, 8),
      status: 'active',
      created_by_id: userId,
      updated_by_id: userId,
    });
    if (userData.city_id) {
      await City.findOne({
        where: {
          id: userData.city_id,
        },
      }).then((city) => {
        user.setCity(city);
      });
    }
    if (userData.roles) {
      await Role.findAll({
        where: {
          name: {
            [Op.or]: userData.roles,
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
      return user.getRoles().then((roles) => {
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
      return user.getRoles().then((roles) => {
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

exports.recover = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({
      where: {
        email,
      },
    });

    const token = jwt.sign({ id: user.id }, config.token.secret, {
      expiresIn: 1800, // 30 minutes
    });

    await user.update({
      reset_password_token: bcrypt.hashSync(token, 8),
    });

    const link = `${process.env.CLIENT_URL}/resetPassword/${token}`;
    const subject = 'Password change request';
    const html = `
      <html>
      <head>
          <style>
          </style>
      </head>
      <body>
          <p>Hi ${user.first_name},</p>
          <p>You requested to reset your password.</p>
          <p> Please, click the link below to reset your password</p>
          <a href="${link}">${link}</a>
      </body>
      </html>
    `;
    sendMail(user.email, subject, html);
    res.status(200).send({
      message: 'Email sent',
    });
  } catch (error) {
    next(error);
  }
};

exports.reset = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    let userId;
    // eslint-disable-next-line consistent-return
    jwt.verify(token, config.token.secret, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          statusCode: '401',
          message: 'Token Expires!',
        });
      }
      userId = decoded.id;
    });
    const user = await User.findOne({
      where: {
        id: userId,
      },
    });
    if (!user) {
      next({
        statusCode: '401',
        message: 'No valid token',
      });
    } else {
      const tokenIsValid = bcrypt.compareSync(
        token,
        user.reset_password_token,
      );
      if (!tokenIsValid) {
        next({
          statusCode: '401',
          message: 'Password reset token is invalid or has expired',
        });
      }
      const passwordHash = await bcrypt.hashSync(password, 8);
      await user.update({
        password: passwordHash,
      });

      res.status(200).send({
        message: 'Password updated!',
      });
    }
  } catch (error) {
    next(error);
  }
};
