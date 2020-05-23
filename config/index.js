require('dotenv').config();

const config = {
  server: {
    port: process.env.PORT || 3000,
    origin: (process.env.SERVER_ORIGIN && process.env.SERVER_ORIGIN.split(',')) || '*',
  },
  token: {
    secret: process.env.TOKEN_SECRET,
    expires: process.env.TOKEN_EXPIRES,
  },
};

module.exports = config;
