const {
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLNonNull,
} = require('graphql');

exports.postNotification = new GraphQLObjectType({
  name: 'postNotification',
  fields: {
    success: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
  },
});
