const {
  GraphQLNonNull,
  GraphQLObjectType,
  // GraphQLBoolean,
  GraphQLString,
  GraphQLFloat,
  GraphQLList,
} = require('graphql');

const countChannels = new GraphQLObjectType({
  name: 'countChannels',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    count: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
  },
});

exports.channelLive = new GraphQLObjectType({
  name: 'channelLive',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    countChannels: {
      type: new GraphQLList(countChannels),
    },
  },
});
