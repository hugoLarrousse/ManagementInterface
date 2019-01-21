const {
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
  GraphQLEnumType,
} = require('graphql');
const type = require('../types');
const { createResolver, makeEnumType } = require('../utils');
const notification = require('../resolvers/notification');

const targetTypeEnum = new GraphQLEnumType({
  name: 'TARGET_TYPES',
  values: makeEnumType(['team', 'everyone', 'everyoneWhoPay']),
});


exports.postNotification = {
  description: ('post notification'),
  type: type.notification.postNotification,
  args: {
    message: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'message',
    },
    target: {
      type: new GraphQLNonNull(targetTypeEnum),
      description: 'target',
    },
    teamId: {
      type: GraphQLString,
      description: 'team Id',
    },
    userIds: {
      type: new GraphQLList(GraphQLString),
      description: 'user Ids',
    },
  },
  resolve: createResolver({ isAuthRequired: false }, (_, args) => {
    return notification.postNotification(args);
  }),
};
