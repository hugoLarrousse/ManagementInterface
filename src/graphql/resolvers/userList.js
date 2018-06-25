const { ObjectID } = require('mongodb');

const mongo = require('../../db/mongo');

const databaseName = process.env.databaseH7;

const userCollection = 'users';
const integrationCollection = 'integrations';

const findIntegration = (integrations, role) => {
  if (integrations.length > 0) {
    return integrations.reduce((acc, currentValue, index) => {
      if (index === 0) {
        return currentValue.name;
      }
      return `${acc} ${currentValue.name}`;
    }, '');
  } else if (role === 'spectator') {
    return 'spectator';
  }
  return '';
};

const differentFunnelPosition = {
  AUTO_REGISTER: 'auto register',
  ACTIVE: 'confirmed',
  NOT_CONFIRMED_YET: 'not_confirmed_yet',
  INVITED: 'invited',
};

const normalizeUsers = (users) => {
  return users.map(user => {
    return {
      subDate: user.create_on || 0,
      mail: user.email || '',
      integration: findIntegration(user.integrations, user.role),
      lastSeen: user.last_connected || 0,
      funnelPosition: user.integrations.length > 0 && user.status === 'ACTIVE' ? 'paired' : differentFunnelPosition[user.status],
    };
  });
};


exports.info = async (args) => {
  const users = await mongo.find(databaseName, userCollection, { orga_id: ObjectID(args.orgaId) });
  for (const user of users) {
    user.integrations = await mongo.find(databaseName, integrationCollection, {
      userId: ObjectID(user._id),
    });
  }
  return normalizeUsers(users);
};
