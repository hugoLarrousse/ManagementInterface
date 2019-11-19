const { GraphQLList } = require('graphql');

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
