/* eslint-disable no-param-reassign */
const isString = require('lodash/isString');
const db = require('../models');

const { Op } = db.Sequelize;

const searchQuery = (search) => {
  const searchParsed = isString(search) ? JSON.parse(search) : search;
  const searchEntries = Object.entries(searchParsed);
  searchEntries.forEach((entry) => {
    if (entry[1]?.operator === 'search') {
      entry[1] = {
        [Op.iLike]: `%${entry[1].value}%`,
      };
    }
  });
  const searchCompleted = Object.fromEntries(searchEntries);
  return searchCompleted;
};

module.exports = searchQuery;
