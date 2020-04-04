const requestRetry = require('requestretry');

const mongo = require('../../db/mongo');


const databaseName = process.env.databaseH7;
const { socketUrl } = process.env;
const devicesCollection = 'devices';
const organisationCollection = 'organisations';

const optionsGetInfo = {
  url: `${socketUrl}/pi`,
  method: 'GET',
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
    Authorization: process.env.fixedTokenPi,
  },
  json: true,
};

const optionsRe = {
  url: `${socketUrl}/pi/`,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
    Authorization: process.env.fixedTokenPi,
  },
  json: true,
};

const manageStatus = (active, on) => {
  if (on && active) return 'online';
  if (on) return 'pause';
  if (active) return 'error';
  return 'offline';
};

const getDayHourSchedule = (schedule) => {
  const today = new Date();
  const day = schedule.filter(s => s.day === (today.getDay() || 7) - 1);
  const fromHour = Math.min(...day.map(d => d.from));
  const toHour = Math.max(...day.map(d => d.to));
  return `${fromHour}h-${toHour}h`;
};

exports.data = async () => {
  try {
    // get all pi
    const pis = await mongo.find(databaseName, devicesCollection, { type: 'pi' });

    const { error, body } = await requestRetry(optionsGetInfo);
    if (error) {
      console.log('error :', error);
    }

    // add company if necessary
    const pisNeedCompany = pis.filter(pi => !pi.company);
    for (const pi of pisNeedCompany) {
      const orga = await mongo.findOne(databaseName, organisationCollection, { _id: pi.orgaId });
      if (!orga) {
        console.log('pi :', pi);
      } else {
        const index = pis.findIndex(p => String(p._id) === String(pi._id));
        pis[index].company = orga.name;
      }
    }
    pis.sort((a, b) => {
      return b.company.localeCompare(a.company);
    });

    return pis.reduce((prev, curr) => {
      const status = manageStatus(body.pisActive.find(p => p.serial === curr.serial), body.pisOn.find(p => p === curr.serial));
      const currentChannel = body.pisActive.find(p => p.serial === curr.serial) && body.pisActive.find(p => p.serial === curr.serial).channel;
      prev.push({
        id: String(curr._id),
        name: curr.name,
        version: curr.version || '1.1.3',
        company: curr.company || 'unknown',
        reloadCounter: curr.reloadCounter || 0,
        currentChannelName: currentChannel && currentChannel.name,
        dayHour: curr.schedule && getDayHourSchedule(curr.schedule),
        status,
        statusPi: Boolean(body.pisOn.find(p => p === curr.serial)),
        statusCast: Boolean(body.pisActive.find(p => p.serial === curr.serial)),
        serial: curr.serial,
        teamId: curr.teamId,
        cec: curr.cec,
      });
      return prev;
    }, []);
  } catch (e) {
    console.log('ERROR', e);
    return [];
  }
};

exports.reboot = async ({ serial }) => {
  try {
    optionsRe.body = { serial };
    const { error, body } = await requestRetry({ ...optionsRe, url: `${optionsRe.url}reboot` });
    if (error || body.error) {
      console.log('error :', error || body.error);
      return { done: false };
    }
    return { done: true };
  } catch (e) {
    console.log('ERROR', e);
    return [];
  }
};

exports.reload = async ({ teamId, deviceId }) => {
  try {
    optionsRe.body = { teamId, deviceId };
    const { error, body } = await requestRetry({ ...optionsRe, url: `${optionsRe.url}reload` });
    if (error || body.error) {
      console.log('error :', error || body.error);
      return { done: false };
    }
    return { done: true };
  } catch (e) {
    console.log('ERROR', e);
    return [];
  }
};
