const request = require('../../Utils/request');
const query = require('./query');

const dates = require('../../Utils/dates');

const PATH_FOR_QUERY = '/services/data/v43.0/query/';

const formatKeys = (keys, keysToRemove) => {
  let k = typeof keys === 'string' ? keys : keys.length && keys.join(',');
  if (keysToRemove) {
    for (const keyToRemove of keysToRemove) {
      k = k.replace(`,${keyToRemove}`, '');
    }
  }
  return k;
};

const getData = (baseUrl, accessToken, dataType, lastModifiedDateTZ, restrictions) => {
  const date = lastModifiedDateTZ || '';
  return request(
    baseUrl, PATH_FOR_QUERY, `${formatKeys(query[dataType], restrictions)}${date}`,
    'GET', { Authorization: `Bearer ${accessToken}` }, null, true
  );
};

const getMoreData = (baseUrl, accessToken, pathUrl) => {
  return request(baseUrl, pathUrl, null, 'GET', { Authorization: `Bearer ${accessToken}` }, null, true);
};

const getDealsOpened = async (token, baseUrl, period, allIntegrations, restrictions) => {
  const startDateTZ = `${(new Date(dates.timestampStartPeriod(period))).toISOString().split('.')[0]}Z`;
  try {
    let hasMore = false;
    let urlPath = '';
    let results = null;
    const arrayData = [];
    do {
      if (!hasMore) {
        results = await getData(baseUrl, token, 'opportunityOpened', startDateTZ, restrictions);
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
    return (arrayData.filter(d => integrationIds.includes(d.OwnerId))).map(a => {
      return { ...a, id: a.Id };
    });
  } catch (e) {
    throw new Error(`${__filename}
      ${getDealsOpened.name}
      ${e.message}`);
  }
};

const getDealsWon = async (token, baseUrl, period, allIntegrations, restrictions) => {
  const date = new Date(period);
  const startDate = `${date.getFullYear()}-${date.getMonth() + 1 < 10 ?
    `0${date.getMonth() + 1}` : date.getMonth() + 1}-${date.getDate() < 10 ?
    `0${date.getDate()}` : date.getDate()}`;
  try {
    let hasMore = false;
    let urlPath = '';
    let results = null;
    const arrayData = [];
    do {
      if (!hasMore) {
        results = await getData(baseUrl, token, 'opportunityWon', startDate, restrictions);
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
    return (arrayData.filter(d => integrationIds.includes(d.OwnerId))).map(a => {
      return { ...a, id: a.Id };
    });
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
    const arrayData = [];
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
    return (arrayData.filter(d => integrationIds.includes(d.OwnerId))).map(a => {
      return { ...a, id: a.Id };
    });
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
    const arrayData = [];
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
    return (arrayData.filter(d => integrationIds.includes(d.OwnerId))).map(a => {
      return { ...a, id: a.Id };
    });
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
