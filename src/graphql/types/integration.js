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
    spectatorCount: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    spectatorPercentage: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
  },
});
