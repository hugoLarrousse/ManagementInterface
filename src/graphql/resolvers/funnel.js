const { ObjectID } = require('mongodb');
const mongo = require('../../db/mongo');

const { makePercentage } = require('../utils');

const databaseName = process.env.databaseH7;
const userCollection = 'users';
const integrationCollection = 'integrations';

const SEVEN_DAYS_MILLISECONDS = 604800000;


const usersFound = mongo.find(databaseName, userCollection, { status: 'ACTIVE' });
const autoRegisterCount = mongo.count(databaseName, userCollection, { status: 'AUTO_REGISTER' });
const signedUpCount = mongo.count(databaseName, userCollection, { status: 'NOT_CONFIRMED_YET' });
const invitedCount = mongo.count(databaseName, userCollection, { status: 'INVITED' });


exports.count = async () => {
  const result = await Promise.all([signedUpCount, autoRegisterCount, usersFound]);

  for (const user of result[2]) {
    user.integrations = await mongo.find(databaseName, integrationCollection, {
      userId: ObjectID(user._id),
      token: {
        $ne: null,
      },
    });
  }
  const pairedUsers = result[2].filter(user => user.integrations.length > 0 || user.role === 'spectator');
  const recentUsers = pairedUsers.filter(user =>
    user.last_connected > Date.now() - SEVEN_DAYS_MILLISECONDS);
  const confirmedCount = result[2].length - pairedUsers.length;
  const total = result[0]
    + confirmedCount
    + pairedUsers.length;
  return {
    signedUpCount: result[0],
    signedUpPercentage: makePercentage(result[0], total),
    confirmedCount,
    confirmedPercentage: makePercentage(confirmedCount, total),
    pairedCount: pairedUsers.length - recentUsers.length,
    pairedPercentage: makePercentage(pairedUsers.length - recentUsers.length, total),
    activeCount: recentUsers.length,
    activePercentage: makePercentage(recentUsers.length, total),
    invitedCount,
    autoRegisterCount: result[1],
  };
};
