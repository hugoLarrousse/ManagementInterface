const {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLBoolean,
} = require('graphql');

exports.manual = new GraphQLObjectType({
  name: 'dataTest',
  fields: {
    inProgress: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
  },
});
