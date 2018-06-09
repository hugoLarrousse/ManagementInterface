const mongo = require('../../db/mongo');

const databaseName = process.env.databaseH7;

const UserCollection = 'users';

const SEVEN_DAYS_MILLISECONDS = 604800000;
const FIVE_MINUTES_MILLISECONDS = 300000;
// const licenceCollection = 'licences';

// const licenceCount = mongo.count(databaseName, licenceCollection);
//   const licencePayingCount = mongo.count(databaseName, licenceCollection, {
//     planId: { $ne: null },
//   });

const userCount = mongo.count(databaseName, UserCollection, { status: 'ACTIVE' });
const managerCount = mongo.count(databaseName, UserCollection, { status: 'ACTIVE', role: 'manager' });
const users = mongo.find(databaseName, UserCollection, { status: 'ACTIVE' });


exports.count = async () => {
  await Promise.all([userCount,
    managerCount,
    users,
  ]);
  const usersUnpromising = await users;
  const recentUsers = usersUnpromising.filter(user =>
    user.last_connected > Date.now() - SEVEN_DAYS_MILLISECONDS).map(user => user.team_id);

  const liveUsersCount = usersUnpromising.filter(user =>
    user.last_connected > Date.now() - FIVE_MINUTES_MILLISECONDS).length;

  const teamCount = new Set(usersUnpromising.map(user => user.team_id)).size;
  return {
    userCount,
    managerCount,
    teamCount,
    activeTeamPercentage: recentUsers.length > 0
      ? (new Set(recentUsers.map(user => user.team_id)).size / teamCount) * 100
      : 0,
    liveUsersCount,
  };
};
