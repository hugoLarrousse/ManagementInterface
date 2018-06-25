const { ObjectID } = require('mongodb');
const mongo = require('../../db/mongo');
const sum = require('lodash/sum');

const { makePercentage } = require('../utils');

const databaseName = process.env.databaseH7;
const userCollection = 'users';
const integrationCollection = 'integrations';


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
  const spectator = usersFound.filter(user => user.role === 'spectator');
  for (const user of usersFound) {
    user.integrations = await mongo.find(databaseName, integrationCollection, {
      userId: ObjectID(user._id),
      token: {
        $ne: null,
      },
    });
  }
  const integrations = usersFound.map(user => user.integrations);

  const integrationCount = integrations.reduce(reducer, {});
  const integrationTotal = sum(Object.values(integrationCount)) + spectator.length;
  return {
    pipedriveCount: integrationCount.Pipedrive || 0,
    pipedrivePercentage: makePercentage(integrationCount.Pipedrive, integrationTotal),
    hubspotCount: integrationCount.Hubspot || 0,
    hubspotPercentage: makePercentage(integrationCount.Hubspot, integrationTotal),
    spectatorCount: spectator.length || 0,
    spectatorPercentage: makePercentage(spectator.length, integrationTotal),
  };
};
