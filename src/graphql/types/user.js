const {
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLNonNull,
} = require('graphql');

exports.deleteUsers = new GraphQLObjectType({
  name: 'UsersDelete',
  fields: {
    success: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
  },
});
