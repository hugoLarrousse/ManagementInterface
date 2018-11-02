const {
  GraphQLNonNull,
  GraphQLString,
} = require('graphql');
const type = require('../types');
const { createResolver } = require('../utils');
const user = require('../resolvers/user');


exports.deleteUsers = {
  description: ('Delete user & co'),
  type: type.user.deleteUsers,
  args: {
    email: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'email',
    },
  },
  resolve: createResolver({ isAuthRequired: true }, (_, args) => {
    return user.deleteUsers(args);
  }),
};
