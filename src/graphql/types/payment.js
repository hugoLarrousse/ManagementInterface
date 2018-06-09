const {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLFloat,
} = require('graphql');


exports.count = new GraphQLObjectType({
  name: 'countPayment',
  fields: {
    licencePayingCount: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    licencePayingPercentage: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    mrr: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
  },
});
