const {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLFloat,
} = require('graphql');

exports.allData = new GraphQLObjectType({
  name: 'allData',
  fields: {
    inProgress: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
  },
});

const countType = new GraphQLObjectType({
  name: 'countType',
  fields: {
    crm: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    heptaward: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
  },
});

exports.data = new GraphQLObjectType({
  name: 'data',
  fields: {
    meetings: {
      type: new GraphQLNonNull(countType),
    },
    calls: {
      type: new GraphQLNonNull(countType),
    },
    dealOpened: {
      type: new GraphQLNonNull(countType),
    },
    dealWon: {
      type: new GraphQLNonNull(countType),
    },
  },
});
