const {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLFloat,
} = require('graphql');

exports.count = new GraphQLObjectType({
  name: 'countIntegration',
  fields: {
    pipedriveCount: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    pipedrivePercentage: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    hubspotCount: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    hubspotPercentage: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    salesforceCount: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    salesforcePercentage: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    asanaCount: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    asanaPercentage: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    noCRMCount: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    noCRMPercentage: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
  },
});
