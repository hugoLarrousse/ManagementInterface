const {
  GraphQLNonNull,
  GraphQLObjectType,
  // GraphQLBoolean,
  GraphQLString,
  GraphQLFloat,
  GraphQLList,
} = require('graphql');

const path = new GraphQLObjectType({
  name: 'path',
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
      type: new GraphQLList(path),
    },
  },
});
