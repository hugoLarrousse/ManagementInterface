const { ObjectID } = require('mongodb');
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

    const data = docs.reduce((prev, curr) => {
      const { _id, updatedAt, ...rest } = curr;
      for (const t of Object.entries(rest)) {
        prev[t[0]] = t[1] + (prev[t[0]] || 0); //eslint-disable-line
      }
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


exports.slidesInfo = async () => {
  const channels = await mongo.find('heptaward', 'library', {
    teamId: {
      $nin: [ObjectID('5c01a70172871b1d6530cd48'), ObjectID('5da72cbd6810dc1523997e9a')],
    },
    name: {
      $nin: ['Demo Channel', 'Your Demo Channel'],
    },
  });
  const channelsRecent = channels.filter(c => c.createdAt > 1577833200000 || c.updatedAt > 1577833200000);
  const slides = channelsRecent.reduce((prev, curr) => {
    prev.push(...curr.slides);
    return prev;
  }, []);
  const types = Object.entries(slides.reduce((prev, curr) => {
    const type = curr.type === 'slideBuilder' ? `${curr.type}-${curr.subtype}` : curr.type;
    prev[type] = prev[type] + 1 || 1; //eslint-disable-line
    return prev;
  }, {})).sort((a, b) => b[1] - a[1]).map(t => ({ name: t[0], value: t[1] }));
  return {
    channelsCount: channelsRecent.length,
    slidesCount: slides.length,
    types,
    slidesCountAverage: (slides.length / channelsRecent.length).toFixed(2),
  };
};
