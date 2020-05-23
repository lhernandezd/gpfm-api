require('dotenv').config();

const config = {
  database: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  dialect: 'postgres',
  operatorsAliases: 0,
  define: {
    timestamp: true,
    underscored: true,
    underscoredAll: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
};

module.exports = {
  development: { database: 'gpfm_dev', ...config },
  test: { database: 'gpfm_test', ...config },
  production: { database: process.env.DATABASE_NAME, ...config },
};

module.exports = config;
