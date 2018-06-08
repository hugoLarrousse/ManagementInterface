const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLNonNull,
  GraphQLString,
} = require('graphql');
const { testType } = require('../types');
const { findOneUser, jwtLogin } = require('../resolvers.js');
const { createResolver } = require('../utils');

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    getOneUser: {
      type: testType,
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
    },
    jwtLogin: {
      type: testType,
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
    },
    // myConversations: {
    //   type: new GraphQLList(conversationType),
    //   args: {
    //     count: {
    //       type: GraphQLInt,
    //     },
    //     before: {
    //       type: GraphQLInt,
    //     },
    //   },
    //   resolve: createResolver({ isAuthRequired: true }, (_, { count, before }) => {
    //     return findManyWithLastMessage(count, before);
    //   }),
    // },
  },
});

exports.queryType = queryType;
