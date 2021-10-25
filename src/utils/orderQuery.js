const isString = require('lodash/isString');

const orderQuery = (order) => {
  const orderParsed = isString(order) ? JSON.parse(order) : order;
  const orderEntries = Object.entries(orderParsed);
  return orderEntries;
};

module.exports = orderQuery;
