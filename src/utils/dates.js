const { format, parseISO } = require('date-fns');

const dateObjFromISOString = (isoStringDate) => {
  const [year, month, day, hour] = format(parseISO(isoStringDate), 'yyyy/M/d/H').split('/');
  return {
    year: parseInt(year, 10),
    month: parseInt(month, 10),
    day: parseInt(day, 10),
    hour: parseInt(hour, 10),
  };
};

module.exports = {
  dateObjFromISOString,
};
