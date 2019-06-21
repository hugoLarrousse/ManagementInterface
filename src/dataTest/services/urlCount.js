const mongo = require('../../db/mongo');
const moment = require('moment');
const logger = require('../Utils/loggerSlack');

module.exports = async () => {
  const count = await mongo.findOne('heptaward', 'counters', { _id: `url-count-${process.env.NODE_ENV}-${moment().format('DD-MM-YYYY')}` });
  if (count) {
    logger.count(count);
  }
};
