const { GraphQLList } = require('graphql');

const type = require('../types');
const list = require('../resolvers/list');
const { createResolver } = require('../utils');

exports.info = {
  type: new GraphQLList(type.list.info),
  description: 'Analytics about users',
  resolve: createResolver(
    { isAuthRequired: true },
    () => {
      return list.info();
    }
  ),
};
