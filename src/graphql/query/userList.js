const {
  GraphQLList,
  GraphQLNonNull,
  GraphQLID,
} = require('graphql');

const type = require('../types');
const userList = require('../resolvers/userList');
const { createResolver } = require('../utils');

exports.info = {
  type: new GraphQLList(type.userList.info),
  description: 'Analytics about users of a specific team',
  args: {
    orgaId: {
      type: new GraphQLNonNull(GraphQLID),
      description: 'Orga of the team',
    },
  },
  resolve: createResolver(
    { isAuthRequired: true },
    (_, args) => {
      return userList.info(args);
    }
  ),
};
