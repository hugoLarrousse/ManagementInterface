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
    activeTeamPercentage: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    liveUsersCount: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
  },
});
