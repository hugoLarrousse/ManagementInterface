const { GraphQLList } = require('graphql');

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

exports.teams = {
  type: new GraphQLList(type.user.getTeams),
  description: 'Get all teams',
  resolve: createResolver(
    { isAuthRequired: true },
    () => {
      return user.getTeams();
    }
  ),
};

exports.organizations = {
  type: new GraphQLList(type.user.organizations),
  description: 'Get all organizations',
  resolve: createResolver(
    { isAuthRequired: true },
    () => {
      return user.getOrganizations();
    }
  ),
};
