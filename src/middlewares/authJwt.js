const jwt = require('jsonwebtoken');
const config = require('../../config/index');
const db = require('../models');

const User = db.user;

// eslint-disable-next-line consistent-return
const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'];

  if (!token) {
    return res.status(403).send({
      message: 'No token provided!',
    });
  }

  // eslint-disable-next-line consistent-return
  jwt.verify(token, config.token.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: 'Unauthorized!',
      });
    }
    req.userId = decoded.id;
    next();
  });
};

const isAdmin = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    user.getRoles().then((roles) => {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === 'admin') {
          next();
          return;
        }
      }

      res.status(403).send({
        message: 'Require Admin Role!',
      });
    });
  });
};

const isUser = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    user.getRoles().then((roles) => {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === 'user') {
          next();
          return;
        }
      }

      res.status(403).send({
        message: 'Require User Role!',
      });
    });
  });
};

const isUserOrAdmin = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    user.getRoles().then((roles) => {
      // eslint-disable-next-line no-plusplus
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === 'user') {
          next();
          return;
        }

        if (roles[i].name === 'admin') {
          next();
          return;
        }
      }

      res.status(403).send({
        message: 'Require User or Admin Role!',
      });
    });
  });
};

const authJwt = {
  verifyToken,
  isAdmin,
  isUser,
  isUserOrAdmin,
};
module.exports = authJwt;
