const {
  GraphQLString,
  GraphQLNonNull,
  GraphQLObjectType,
} = require('graphql');


exports.jwt = new GraphQLObjectType({
  name: 'Jwt',
  fields: {
    token: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
});
