const mongo = require('../../db/mongo');
const moment = require('moment');
const logger = require('../Utils/loggerSlack');

exports.statusCode = async () => {
  const statusCode = await mongo.findOne('heptaward', 'counters', { _id: `uptime-status-code-${moment().format('DD-MM-YYYY')}` }); //eslint-disable-line
  if (statusCode) {
    const { _id, ...rest } = statusCode;
    logger.count(rest);
  }
};

exports.elapseTime = async () => {
  const originUrl = await mongo.findOne('heptaward', 'counters', { _id: `uptime-elapse-time-${moment().format('DD-MM-YYYY')}` }); //eslint-disable-line
  if (originUrl) {
    const { timer } = originUrl;
    const avgTime = (timer.reduce((a, b) => a + b, 0) / timer.length).toFixed(2);
    logger.info(`average elapse time: ${Math.round(avgTime)}ms`);
  }
};
