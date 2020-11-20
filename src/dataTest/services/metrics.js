const mongo = require('../../db/mongo');
const moment = require('moment');
const logger = require('../Utils/loggerSlack');

exports.pathCount = async () => {
  const count = await mongo.findOne('heptaward', 'counters', { _id: `url-count-${process.env.NODE_ENV}-${moment().format('DD-MM-YYYY')}` });
  if (count) {
    const { _id, ...rest } = count;
    logger.count({ total: Object.values(rest).reduce((prev, curr) => prev + curr, 0), ...rest });
  }
};

exports.statusCode = async () => {
  const statusCode = await mongo.findOne('heptaward', 'counters', { _id: `url-status-code-${process.env.NODE_ENV}-${moment().format('DD-MM-YYYY')}` }); //eslint-disable-line
  if (statusCode) {
    const { _id, ...rest } = statusCode;
    logger.count(rest);
  }
};

exports.originUrl = async () => {
  const originUrl = await mongo.findOne('heptaward', 'counters', { _id: `url-origin-url-${process.env.NODE_ENV}-${moment().format('DD-MM-YYYY')}` }); //eslint-disable-line
  if (originUrl) {
    const { _id, ...rest } = originUrl;
    logger.count(rest);
  }
};

exports.locationPathCount = async () => {
  const pathLocation = await mongo.findOne('heptaward', 'counters', { _id: `path-count-${process.env.NODE_ENV}-${moment().format('DD-MM-YYYY')}` }); //eslint-disable-line
  if (pathLocation) {
    const { _id, updatedAt, ...rest } = pathLocation;
    logger.info(Object.entries(rest).sort((a, b) => b[1] - a[1]).reduce((prev, curr) => {
      return `${prev}${curr[0]}: ${curr[1]}\n`;
    }, ''));
  }
};

