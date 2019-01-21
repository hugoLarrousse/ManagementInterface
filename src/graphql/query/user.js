const type = require('../types');
const user = require('../resolvers/user');
const { createResolver } = require('../utils');

exports.teamsUsers = {
  type: type.user.getTeamsUsers,
  description: 'Get all teams and users',
  resolve: createResolver(
    { isAuthRequired: true },
    () => {
      return user.getTeamsUsers();
    }
  ),
};
