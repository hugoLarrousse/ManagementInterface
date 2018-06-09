const {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLFloat,
} = require('graphql');


exports.count = new GraphQLObjectType({
  name: 'countSub',
  fields: {
    userCount: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    managerCount: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    teamCount: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    licenceCount: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    licencePayingCount: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    paidAccountRate: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
  },
});
