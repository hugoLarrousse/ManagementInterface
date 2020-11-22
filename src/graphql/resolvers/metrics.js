
const moment = require('moment');
const mongo = require('../../db/mongo');

exports.pagesVisited = async ({ period, date = moment().format('ww') }) => {
  if (period === 'week') {
    const data = await mongo.findOne('heptaward', 'counters', { _id: `path-count-production-${date}-2020` });
    if (data) {
      const { _id, updatedAt, ...rest } = data;
      return {
        data: Object.entries(rest).sort((a, b) => b[1] - a[1]).reduce((prev, curr) => {
          prev.push({ name: curr[0], value: curr[1] });
          return prev;
        }, []),
      };
    }
  }
  if (period === 'month') {
    const [month, year] = date.split('-');
    if (!month || !year) return { data: null };
    let yearNumber = Number(year);
    const monthNumber = Number(month);

    const firstWeek = moment(new Date(yearNumber, monthNumber - 1, 1)).format('ww');
    const lastWeek = moment(new Date(yearNumber, monthNumber, 0)).format('ww');

    const ids = [];

    if (firstWeek > lastWeek) {
      yearNumber += 1;
      for (let i = Number(firstWeek); i <= Number(firstWeek + lastWeek); i += 1) {
        ids.push(`path-count-production-${i}-${yearNumber}`);
      }
    } else {
      for (let i = Number(firstWeek); i <= Number(lastWeek); i += 1) {
        ids.push(`path-count-production-${i}-${yearNumber}`);
      }
    }

    const docs = await mongo.find('heptaward', 'counters', { _id: { $in: ids } });
    if (docs.length === 0) return { data: null };

    let properties = [];

    for (const doc of docs) {
      const { _id, updatedAt, ...rest } = doc;
      properties.push(...Object.keys(rest));
    }
    properties = [...new Set(properties)];

    const data = properties.reduce((prev, property) => {
      prev[property] = docs.reduce((prevT, curr) => { // eslint-disable-line
        return prevT + (curr[property] || 0);
      }, 0);
      return prev;
    }, {});

    return {
      data: Object.entries(data).sort((a, b) => b[1] - a[1]).reduce((prev, curr) => {
        prev.push({ name: curr[0], value: curr[1] });
        return prev;
      }, []),
    };
  }
  return { data: null };
};
