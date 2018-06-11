const mongo = require('../../db/mongo');

const databaseName = process.env.databaseH7;

const UserCollection = 'users';

const SEVEN_DAYS_MILLISECONDS = 604800000;
const FIVE_MINUTES_MILLISECONDS = 300000;

const userCount = mongo.count(databaseName, UserCollection, { status: 'ACTIVE', team_id: { $ne: null } });
const managerCount = mongo.count(databaseName, UserCollection, { status: 'ACTIVE', role: 'manager' });
const users = mongo.find(databaseName, UserCollection, { status: 'ACTIVE', team_id: { $ne: null } });


exports.count = async () => {
  await Promise.all([userCount,
    managerCount,
    users,
  ]);
  const usersUnpromising = await users;
  const recentUsers = usersUnpromising.filter(user =>
    user.last_connected > Date.now() - SEVEN_DAYS_MILLISECONDS).map(user => String(user.team_id));

  const liveUsersCount = usersUnpromising.filter(user =>
    user.last_connected > Date.now() - FIVE_MINUTES_MILLISECONDS).length;

  const teamCount = new Set(usersUnpromising.map(user => String(user.team_id))).size;
  return {
    userCount,
    managerCount,
    teamCount,
    activeTeamPercentage: recentUsers.length > 0
      ? ((new Set(recentUsers).size / teamCount) * 100).toFixed(2)
      : 0,
    liveUsersCount,
  };
};
