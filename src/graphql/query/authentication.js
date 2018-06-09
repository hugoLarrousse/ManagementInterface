const {
  GraphQLNonNull,
  GraphQLString,
} = require('graphql');

const type = require('../types');
const { jwtLogin } = require('../resolvers/authentication');
const { createResolver } = require('../utils');

exports.jwtLoginQuery = {
  type: type.authenticate.jwt,
  description: 'Log User with JWT',
  args: {
    email: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'User to connect email',
    },
    password: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'User to connect password',
    },
  },
  resolve: createResolver({ isAuthRequired: false }, (_, args) => {
    return jwtLogin(args);
  }),
};
