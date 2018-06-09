const {
  GraphQLID,
  GraphQLNonNull,
} = require('graphql');

const type = require('../types');
const { findOneUser } = require('../resolvers/user');
const { createResolver } = require('../utils');

exports.getOneUserQuery = {
  type: type.user.user,
  description: 'Log User with JWT',
  args: {
    _id: {
      type: new GraphQLNonNull(GraphQLID),
      description: '_id user',
    },
  },
  resolve: createResolver(
    { isAuthRequired: true },
    (_, { _id }) => {
      return findOneUser(_id);
    }
  ),
  // resolve: (_, { _id }) => {
  //   return findOneUser(_id);
  // },
};

