const mongo = require('../../db/mongo');
const sum = require('lodash/sum');

const { makePercentage } = require('../utils');

const databaseName = process.env.databaseH7;
const userCollection = 'users';


const users = mongo.find(databaseName, userCollection, { status: 'ACTIVE' });

const reducer = (accumulator, currentValue) => {
  for (const cv of currentValue) {
    if (accumulator[cv.name]) {
      Object.assign(accumulator, { [cv.name]: accumulator[cv.name] + 1 });
    } else {
      Object.assign(accumulator, { [cv.name]: 1 });
    }
  }
  return accumulator;
};


exports.count = async () => {
  const usersFound = await users;
  const integrations = usersFound.map(user => user.integrations);

  const integrationCount = integrations.reduce(reducer, {});
  const integrationTotal = sum(Object.values(integrationCount));
  return {
    pipedriveCount: integrationCount.Pipedrive || 0,
    pipedrivePercentage: integrationCount.Pipedrive ?
      makePercentage(integrationCount.Pipedrive, integrationTotal) : 0,
    hubspotCount: integrationCount.Hubspot || 0,
    hubspotPercentage: integrationCount.Hubspot
      ? makePercentage(integrationCount.Hubspot, integrationTotal)
      : 0,
    spectatorCount: integrationCount.spectator || 0,
    spectatorPercentage: integrationCount.spectator
      ? makePercentage(integrationCount.spectator, integrationTotal)
      : 0,
  };
};
