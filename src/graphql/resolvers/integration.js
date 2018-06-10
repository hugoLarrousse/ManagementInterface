const mongo = require('../../db/mongo');
const sum = require('lodash/sum');

const { makePercentage } = require('../utils');

const databaseName = process.env.databaseH7;
const userCollection = 'users';


const users = mongo.find(databaseName, userCollection, { status: 'ACTIVE' });

const reducer = (accumulator, currentValue) => {
  for (const crt of currentValue) {
    if (accumulator[crt.name]) {
      Object.assign(accumulator, { [crt.name]: accumulator[crt.name] + 1 });
    } else {
      Object.assign(accumulator, { [crt.name]: 1 });
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
    pipedrivePercentage: makePercentage(integrationCount.Pipedrive, integrationTotal),
    hubspotCount: integrationCount.Hubspot || 0,
    hubspotPercentage: makePercentage(integrationCount.Hubspot, integrationTotal),
    spectatorCount: integrationCount.spectator || 0,
    spectatorPercentage: makePercentage(integrationCount.spectator, integrationTotal),
  };
};
