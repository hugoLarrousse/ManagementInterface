const type = require('../types');
const metrics = require('../resolvers/metrics');
const { createResolver } = require('../utils');

const {
  GraphQLNonNull,
  GraphQLString,
} = require('graphql');

exports.pagesVisitedQuery = {
  type: type.metrics.pagesVisited,
  description: 'get pages visited',
  args: {
    period: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Period (week or month)',
    },
    date: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'date corresponding to the period',
    },
  },
  resolve: createResolver(
    { isAuthRequired: true },
    (_, args) => {
      return metrics.pagesVisited(args);
    }
  ),
};
