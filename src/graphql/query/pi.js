const { GraphQLList, GraphQLNonNull, GraphQLString } = require('graphql');

const type = require('../types');
const pi = require('../resolvers/pi');
const { createResolver } = require('../utils');

exports.data = {
  type: new GraphQLList(type.pi.data),
  description: 'All about Pis',
  resolve: createResolver(
    { isAuthRequired: true },
    () => {
      return pi.data();
    }
  ),
};

exports.logs = {
  type: new GraphQLList(type.pi.logs),
  description: 'Logs for a pi',
  args: {
    serial: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'serial Pi',
    },
  },
  resolve: createResolver(
    { isAuthRequired: true },
    (_, args) => {
      return pi.logs(args);
    }
  ),
};
