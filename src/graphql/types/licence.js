const {
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLString,
} = require('graphql');

exports.update = new GraphQLObjectType({
  name: 'UserDelete',
  fields: {
    success: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    orgaId: {
      type: new GraphQLNonNull(GraphQLString),
    },
    expirationDate: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
});
