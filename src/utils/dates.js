const { format, parseISO } = require('date-fns');
const locale = require('date-fns/locale');

const dateObjFromISOString = (isoStringDate, dateFormat = 'yyyy/M/d/H/mm', dateLocale = 'enUS') => {
  const [year, month, day, hour, minute] = format(parseISO(isoStringDate), dateFormat, {
    locale: locale[dateLocale],
  }).split('/');

  return {
    year: parseInt(year, 10),
    month: /[a-zA-Z]/.test(month) ? month : parseInt(month, 10),
    day: parseInt(day, 10),
    hour: parseFloat(hour, 10),
    minute: parseInt(minute, 10),
  };
};

module.exports = {
  dateObjFromISOString,
};
