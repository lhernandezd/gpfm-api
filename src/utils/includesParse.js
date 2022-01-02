const isObject = require('lodash/isObject');
const isArray = require('lodash/isArray');
const db = require('../models');

const includesParse = (includes) => {
  const includesArray = [];
  if (isArray(includes)) {
    includes.forEach((include) => {
      const includeParsed = include.includes('include') ? JSON.parse(include) : include;
      if (isObject(includeParsed)) {
        includesArray.push({
          model: db[includeParsed.model],
          include: [db[includeParsed.include]],
        });
      } else {
        includesArray.push({
          model: db[includeParsed],
        });
      }
    });
  }

  return includesArray;
};

module.exports = includesParse;
