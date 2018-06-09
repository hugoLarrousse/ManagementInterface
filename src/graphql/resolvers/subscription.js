const mongo = require('../../db/mongo');

const databaseName = process.env.databaseH7;

const UserCollection = 'users';
const licenceCollection = 'licences';

exports.count = async () => {
  const userCount = mongo.count(databaseName, UserCollection, { status: 'ACTIVE' });
  const managerCount = mongo.count(databaseName, UserCollection, { status: 'ACTIVE', role: 'manager' });
  const users = mongo.find(databaseName, UserCollection, { status: 'ACTIVE' });
  const licenceCount = mongo.count(databaseName, licenceCollection);
  const licencePayingCount = mongo.count(databaseName, licenceCollection, {
    planId: { $ne: null },
  });
  await Promise.all([userCount,
    managerCount,
    licenceCount,
    licencePayingCount,
    users,
  ]);
  const teamCount = new Set((await users).map(user => user.team_id)).size;
  return {
    userCount,
    managerCount,
    teamCount,
    licenceCount,
    licencePayingCount,
    paidAccountRate: (await teamCount / await licencePayingCount) * 100,
  };
};
