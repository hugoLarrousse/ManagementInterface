const formatDateStartMonth = (timestamp = Date.now()) => {
  const date = new Date(timestamp);
  let month = date.getMonth() + 1;
  if (month < 10) { month = `0${month}`; }
  if (month > 11) { month -= 1; }

  return `${date.getFullYear()}-${month}-01`;
};

const formatDateEndMonth = (timestamp = Date.now()) => {
  let date = new Date(timestamp);
  date.setDate(15);
  const lastDayMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).setHours(23, 59, 59, 999);
  date = new Date(lastDayMonth);
  let month = date.getMonth() + 1;
  if (month < 10) { month = `0${month}`; }
  if (month > 11) { month -= 1; }

  return `${date.getFullYear()}-${month}-${date.getDate()}`;
};

const setStartMonthTimestamp = (timestamp = Date.now()) => {
  let date = new Date(timestamp).setDate(1);
  date = new Date(date).setHours(0, 0, 0, 0);

  return date;
};
const setEndMonthTimestamp = (timestamp = Date.now()) => {
  const date = new Date(timestamp);
  date.setDate(15);
  const lastDayMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).setHours(23, 59, 59, 999);

  return lastDayMonth;
};

const timestampStartPeriode = (period = 'day', date = new Date()) => {
  switch (period) {
    case 'day':
      return date.setHours(0, 0, 0, 0);
    case 'week':
      return new Date(date.setUTCDate(date.getUTCDate() - (date.getUTCDay() + 1))).setHours(0, 0, 0, 0);
    case 'month':
      return new Date(date.getFullYear(), date.getMonth(), 1).setHours(0, 0, 0, 0);
    case 'quarter':
      if (date.getMonth() < 3) {
        return new Date(date.getFullYear(), 0, 1).setHours(0, 0, 0, 0);
      } else if (date.getMonth() < 6) {
        return new Date(date.getFullYear(), 3, 1).setHours(0, 0, 0, 0);
      } else if (date.getMonth() < 9) {
        return new Date(date.getFullYear(), 6, 1).setHours(0, 0, 0, 0);
      }
      return new Date(date.getFullYear(), 9, 1).setHours(0, 0, 0, 0);
    case 'semester':
      if (date.getMonth() < 6) {
        return new Date(date.getFullYear(), 0, 1).setHours(0, 0, 0, 0);
      }
      return new Date(date.getFullYear(), 6, 1).setHours(0, 0, 0, 0);
    case 'year':
      return new Date(date.getFullYear(), 0, 1).setHours(0, 0, 0, 0);
    default:
      return Date.now();
  }
};

const timestampEndPeriode = (periode, date = new Date()) => {
  let diffDay;
  switch (periode) {
    case 'day':
      return date.setHours(23, 59, 59, 999);
    case 'week':
      diffDay = 7 - date.getDay();
      return new Date(date.setDate(date.getUTCDate() + diffDay)).setHours(23, 59, 59, 999);
    case 'month':
      return new Date(date.getFullYear(), date.getMonth() + 1, 0).setHours(23, 59, 59, 999);
    case 'quarter':
      if (date.getMonth() < 3) {
        return new Date(date.getFullYear(), 3, 0).setHours(23, 59, 59, 999);
      } else if (date.getMonth() < 6) {
        return new Date(date.getFullYear(), 6, 0).setHours(23, 59, 59, 999);
      } else if (date.getMonth() < 9) {
        return new Date(date.getFullYear(), 9, 0).setHours(23, 59, 59, 999);
      }
      return new Date(date.getFullYear(), 12, 0).setHours(23, 59, 59, 999);
    case 'semester':
      if (date.getMonth() < 6) {
        return new Date(date.getFullYear(), 6, 0).setHours(23, 59, 59, 999);
      }
      return new Date(date.getFullYear(), 12, 0).setHours(23, 59, 59, 999);
    case 'year':
      return new Date(date.getFullYear(), 12, 0).setHours(23, 59, 59, 999);
    default:
      return date.setHours(23, 59, 59, 999);
  }
};

exports.formatDateStartMonth = formatDateStartMonth;
exports.formatDateEndMonth = formatDateEndMonth;
exports.setStartMonthTimestamp = setStartMonthTimestamp;
exports.setEndMonthTimestamp = setEndMonthTimestamp;
exports.timestampStartPeriode = timestampStartPeriode;
exports.timestampEndPeriode = timestampEndPeriode;
