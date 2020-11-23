const {
  GraphQLNonNull,
  GraphQLObjectType,
  // GraphQLBoolean,
  GraphQLString,
  GraphQLFloat,
  GraphQLList,
} = require('graphql');

const nameValue = new GraphQLObjectType({
  name: 'nameValue',
  fields: {
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    value: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
  },
});

exports.pagesVisited = new GraphQLObjectType({
  name: 'pagesVisited',
  fields: {
    data: {
      type: new GraphQLList(nameValue),
    },
  },
});

exports.slidesInfo = new GraphQLObjectType({
  name: 'slidesInfo',
  fields: {
    types: {
      type: new GraphQLList(nameValue),
    },
    channelsCount: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    slidesCount: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    slidesCountAverage: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
  },
});
