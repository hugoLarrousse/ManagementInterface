const winston = require('winston');
const WinstonSlack = require('winston-slack-hook');


const env = process.env.NODE_ENV || 'development';
const loggerEnabledStatus = process.env.LOGGER || 'all';

const transports = [];

if (env === 'development') {
  transports.push(new (WinstonSlack)({
    hookUrl: process.env.slackUrl,
    username: 'Louis-Eric',
    channel: '#test-automation',
  }));
}

const customLogger = winston.createLogger({
  transports,
});

if (env === 'test' || loggerEnabledStatus === 'none') {
  customLogger.remove(winston.transports.Console);
}

const createLabelError = (crm, type, email, period) => {
  return `
      crm: ${crm}
      type: ${type}
      period: ${period}
      email: ${email}
`;
};

const createLabelInfo = (message) => {
  return `*${message}*`;
};

const error = async (crm, type, email, period, differences) => {
  customLogger.error(createLabelError(crm, type, email, period), differences);
};

const info = async (message) => {
  customLogger.info(createLabelInfo(message));
};

const create = (e) => {
  console.log(`${new Date()} - ${e}`);
};

exports.error = error;
exports.info = info;
exports.create = create;

