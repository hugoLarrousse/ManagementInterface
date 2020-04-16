const requestRetry = require('requestretry');
const moment = require('moment');

const mongo = require('../../db/mongo');
const logger = require('../Utils/loggerSlack');

const { socketUrl, databaseH7: databaseName } = process.env;

const databasePi = 'pi';
const devicesCollection = 'devices';
const logsCollections = 'logs';

const optionsGetInfo = {
  url: `${socketUrl}/pi`,
  method: 'GET',
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
    Authorization: process.env.fixedTokenPi,
  },
  json: true,
};

const shouldHaveUTCChannel = (schedule, timezone = 'Europe/Paris') => {
  if (!schedule || !schedule.length === 0) return false;
  const now = moment().tz(timezone || 'Europe/Paris');
  const day = now.day() || 7;
  const channelsOfTheDay = schedule.filter(c => c.day === day - 1);
  if (channelsOfTheDay.length === 0) return false;
  const time = Number(`${now.hours() + ((now.minutes() * 100) / 6000)}`);
  const currentChannel = channelsOfTheDay.find(c => c.from <= time && c.to > time);
  return Boolean(currentChannel);
};

exports.checkStatusPis = async () => {
  try {
    const pis = await mongo.find(databaseName, devicesCollection, { type: 'pi', alert: true });

    if (pis.length === 0) return null;
    const { error, body: pisInfoSocket } = await requestRetry(optionsGetInfo);
    if (error) {
      throw Error(`error request socket: ${error}`);
    }
    for (const pi of pis) {
      if (!(pisInfoSocket.pisOn.find(p => p === pi.serial))) {
        const date = `[${moment().tz(pi.timezone || 'Europe/Paris').format('DD/MM/YYYY - kk:mm')} (${pi.timezone || 'Europe/Paris'})]`;
        await mongo.insert(databasePi, logsCollections, { serial: pi.serial, type: 'pi-inactive', message: `${date} pi inactive` });
        logger.error2(`${date} *${pi.name}* --> INACTIVE`);
        continue; //eslint-disable-line
      }
      if (!(pisInfoSocket.pisActive.find(p => p.serial === pi.serial)) && shouldHaveUTCChannel(pi.schedule, pi.timezone)) {
        const date = `[${moment().tz(pi.timezone || 'Europe/Paris').format('DD/MM/YYYY - kk:mm')} (${pi.timezone || 'Europe/Paris'})]`;
        await mongo.insert(databasePi, logsCollections, { serial: pi.serial, type: 'no-channel', message: `${date} no channel` });
        logger.error2(`${date} *${pi.name}* -->  NO CHANNEL`);
      }
    }
    return 1;
  } catch (e) {
    console.log('checkStatusPis', e.message);
    return null;
  }
};
