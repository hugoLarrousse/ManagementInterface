const request = require('../../Utils/request');
const query = require('./query');

const dates = require('../../Utils/dates');

const PATH_FOR_QUERY = '/services/data/v43.0/query/';

const getData = (baseUrl, accessToken, dataType, lastModifiedDateTZ) => {
  const date = lastModifiedDateTZ || '';
  return request(baseUrl, PATH_FOR_QUERY, `${query[dataType]}${date}`, 'GET', { Authorization: `Bearer ${accessToken}` }, null, true);
};

const getMoreData = (baseUrl, accessToken, pathUrl) => {
  return request(baseUrl, pathUrl, null, 'GET', { Authorization: `Bearer ${accessToken}` }, null, true);
};

const Idtoid = (data) => {
  Object.assign(data, { id: data.Id });
};

const getDealsOpened = async (token, baseUrl, period, allIntegrations) => {
  const startDateTZ = `${(new Date(dates.timestampStartPeriod(period))).toISOString().split('.')[0]}Z`;
  try {
    let hasMore = false;
    let urlPath = '';
    let results = null;
    let arrayData = [];
    do {
      if (!hasMore) {
        results = await getData(baseUrl, token, 'opportunityOpened', startDateTZ);
      } else {
        results = await getMoreData(baseUrl, token, urlPath);
      }
      if (results && results.records && results.records.length > 0) {
        urlPath = results.nextRecordsUrl;
        arrayData.push(...results.records);
      }
      hasMore = (results && results.done === false) || false;
    } while (hasMore);
    const integrationIds = allIntegrations.map(int => int.integrationId);
    arrayData = arrayData.filter(d => integrationIds.includes(d.OwnerId));
    arrayData.forEach(Idtoid);
    return arrayData;
  } catch (e) {
    throw new Error(`${__filename}
      ${getDealsOpened.name}
      ${e.message}`);
  }
};

const getDealsWon = async (token, baseUrl, period, allIntegrations) => {
  const date = new Date(period);
  const startDate = `${date.getFullYear()}-
  ${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}-
  ${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}`;
  try {
    let hasMore = false;
    let urlPath = '';
    let results = null;
    let arrayData = [];
    do {
      if (!hasMore) {
        results = await getData(baseUrl, token, 'opportunityWon', startDate);
      } else {
        results = await getMoreData(baseUrl, token, urlPath);
      }
      if (results && results.records && results.records.length > 0) {
        urlPath = results.nextRecordsUrl;
        arrayData.push(...results.records);
      }
      hasMore = (results && results.done === false) || false;
    } while (hasMore);
    const integrationIds = allIntegrations.map(int => int.integrationId);
    arrayData = arrayData.filter(d => integrationIds.includes(d.OwnerId));
    arrayData.forEach(Idtoid);
    return arrayData;
  } catch (e) {
    throw new Error(`${__filename}
      ${getDealsWon.name}
      ${e.message}`);
  }
};

const getEvents = async (token, baseUrl, period, allIntegrations) => {
  const startDateTZ = `${(new Date(dates.timestampStartPeriod(period))).toISOString().split('.')[0]}Z`;
  try {
    let hasMore = false;
    let urlPath = '';
    let results = null;
    let arrayData = [];
    do {
      if (!hasMore) {
        results = await getData(baseUrl, token, 'event', startDateTZ);
      } else {
        results = await getMoreData(baseUrl, token, urlPath);
      }
      if (results && results.records && results.records.length > 0) {
        urlPath = results.nextRecordsUrl;
        arrayData.push(...results.records);
      }
      hasMore = (results && results.done === false) || false;
    } while (hasMore);
    const integrationIds = allIntegrations.map(int => int.integrationId);
    arrayData = arrayData.filter(d => integrationIds.includes(d.OwnerId));
    arrayData.forEach(Idtoid);

    return arrayData;
  } catch (e) {
    throw new Error(`${__filename}
      ${getEvents.name}
      ${e.message}`);
  }
};

const getTasks = async (token, baseUrl, period, allIntegrations) => {
  const startDateTZ = `${(new Date(dates.timestampStartPeriod(period))).toISOString().split('.')[0]}Z`;
  try {
    let hasMore = false;
    let urlPath = '';
    let results = null;
    let arrayData = [];
    do {
      if (!hasMore) {
        results = await getData(baseUrl, token, 'task', startDateTZ);
      } else {
        results = await getMoreData(baseUrl, token, urlPath);
      }
      if (results && results.records && results.records.length > 0) {
        urlPath = results.nextRecordsUrl;
        arrayData.push(...results.records);
      }
      hasMore = (results && results.done === false) || false;
    } while (hasMore);
    const integrationIds = allIntegrations.map(int => int.integrationId);
    arrayData = arrayData.filter(d => integrationIds.includes(d.OwnerId));
    arrayData.forEach(Idtoid);
    return arrayData;
  } catch (e) {
    throw new Error(`${__filename}
      ${getTasks.name}
      ${e.message}`);
  }
};

exports.getDealsOpened = getDealsOpened;
exports.getDealsWon = getDealsWon;
exports.getTasks = getTasks;
exports.getEvents = getEvents;
