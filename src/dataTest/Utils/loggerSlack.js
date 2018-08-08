const winston = require('winston');
const WinstonSlack = require('winston-slack-hook');


const env = process.env.NODE_ENV || 'development';
const loggerEnabledStatus = process.env.LOGGER || 'all';

const customLogger = winston.createLogger({
  transports: [
    new WinstonSlack({
      hookUrl: process.env.slackUrl,
      username: 'Louis-Eric',
      channel: '#test-automation',
      prependLevel: false,
      appendMeta: false,
      colors: {
        warn: 'warning',
        error: 'danger',
        info: 'good',
        debug: '#bbddff',
      },
    }),
  ],
});

if (env === 'test' || loggerEnabledStatus === 'none') {
  customLogger.remove(winston.transports.Console);
}

const createLabelError = (crm, type, email, period) => {
  return `
      *email: ${email}*
    crm: ${crm}
    type: ${type}
    period: ${period}
`;
};

const createLabelInfo = (message) => {
  return `*${message}*`;
};

const error = async (crm, type, email, period) => {
  customLogger.error(createLabelError(crm, type, email, period));
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

