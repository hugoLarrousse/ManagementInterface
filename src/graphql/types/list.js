const {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLFloat,
  GraphQLString,
  GraphQLID,
} = require('graphql');


exports.info = new GraphQLObjectType({
  name: 'infoList',
  fields: {
    orgaId: {
      type: new GraphQLNonNull(GraphQLID),
    },
    subDate: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    companyName: {
      type: new GraphQLNonNull(GraphQLString),
    },
    mail: {
      type: new GraphQLNonNull(GraphQLString),
    },
    teamSize: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    integration: {
      type: GraphQLString,
    },
    lastSeen: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    plan: {
      type: new GraphQLNonNull(GraphQLString),
    },
    endDate: {
      type: new GraphQLNonNull(GraphQLString),
    },
    funnelPosition: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
});
