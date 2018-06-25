const {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLFloat,
  GraphQLString,
} = require('graphql');

exports.info = new GraphQLObjectType({
  name: 'userInfoList',
  fields: {
    subDate: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    mail: {
      type: new GraphQLNonNull(GraphQLString),
    },
    integration: {
      type: GraphQLString,
    },
    lastSeen: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    funnelPosition: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
});
