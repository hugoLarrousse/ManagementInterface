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

const customLogger2 = winston.createLogger({
  transports: [
    new WinstonSlack({
      hookUrl: process.env.slackUrl,
      username: 'Jean Pi Plus ',
      channel: '#pi-info',
      prependLevel: false,
      appendMeta: false,
      colors: {
        warn: 'warning',
        error: 'danger',
        info: 'good',
        debug: '#bbddff',
      },
    })],
});

if (env === 'test' || loggerEnabledStatus === 'none') {
  customLogger.remove(winston.transports.Console);
  customLogger2.remove(winston.transports.Console);
}

const manageData = (data, crm, type) => {
  if (crm === 'pipedrive') {
    if (type === 'activities') {
      return `{
        meetingsDoublons: ${data.meetingsDoublons}
        meetingsUnregistered: ${data.meetingsUnregistered}
        callsDoublons: ${data.callsDoublons}
        callsUnregistered: ${data.callsUnregistered}
        doublons: ${data.doublons}
      }`;
    }
    return `{
      differenceOpened: ${data.differenceOpened}
      differenceWon: ${data.differenceWon}
      doublons: ${data.doublons}
      unRegistered: ${data.unRegistered}
    }`;
  } else if (crm === 'hubspot') {
    if (type === 'activities') {
      return `{
        meetingsUnregistered: ${data.meetingsUnregistered}
        callsUnregistered: ${data.callsUnregistered}
        doublons: ${data.doublons}
      }`;
    }
    return `{
      differenceOpened: ${data.differenceOpened}
      differenceWon: ${data.differenceWon}
      doublons: ${data.doublons}
      unRegistered: ${data.unRegistered}
    }`;
  } else if (crm === 'salesforce') {
    if (type === 'activities') {
      return `{
        meetingsDoublons:: ${data.meetingsDoublons}
        meetingsUnregistered: ${data.meetingsUnregistered}
        callsDoublons: ${data.callsDoublons}
        callsUnregistered: ${data.callsUnregistered}
      }`;
    }
    return `{
      differenceOpened: ${data.differenceOpened}
      differenceWon: ${data.differenceWon}
      doublons: ${data.doublons}
      unRegistered: ${data.unRegistered}
    }`;
  }
  return null;
};

const createLabelError = (crm, type, email, period, data) => {
  return `
      *email: ${email}*
    crm: ${crm}
    type: ${type}
    period: *${period}*
    data: ${manageData(data, crm, type)}
`;
};

const createLabelInfo = (message) => {
  return `*${message}*`;
};

const error = async (crm, type, email, period, data) => {
  customLogger.error(createLabelError(crm, type, email, period, data));
};

const error2 = async (message) => {
  customLogger2.error(message);
};

const info = async (message, onlyConsole) => {
  if (onlyConsole) {
    console.log(createLabelInfo(message));
    return;
  }
  customLogger.info(createLabelInfo(message));
};

const count = async (message) => {
  const length = Object.values(message).reduce((a, b) => a + b, 0);
  customLogger.info(`
  ${Object.entries(message).reduce((prev, curr) => `${prev} \n *${curr[0]}*: ${(curr[1] * 100) / length}%`, '')}
  `);
};

const create = (e) => {
  console.log(`${new Date()} - ${e}`);
};

exports.error = error;
exports.info = info;
exports.create = create;
exports.count = count;
exports.error2 = error2;

