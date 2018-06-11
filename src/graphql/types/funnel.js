const {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLFloat,
} = require('graphql');

exports.count = new GraphQLObjectType({
  name: 'countFunnel',
  fields: {
    signedUpCount: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    signedUpPercentage: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    confirmedCount: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    confirmedPercentage: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    activeCount: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    activePercentage: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    pairedCount: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    pairedPercentage: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    autoRegisterCount: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    invitedCount: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
  },
});
