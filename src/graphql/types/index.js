const {
  GraphQLString,
  GraphQLNonNull,
  GraphQLObjectType,
} = require('graphql');

const testType = new GraphQLObjectType({
  name: 'Test',
  fields: {
    // id: {
    //   type: new GraphQLNonNull(GraphQLID),
    // },
    firstname: {
      type: new GraphQLNonNull(GraphQLString),
    },
    // surname: {
    //   type: new GraphQLNonNull(GraphQLString),
    // },
    // email: {
    //   type: new GraphQLNonNull(GraphQLString),
    // },
    // profilePictureUrl: {
    //   type: new GraphQLNonNull(GraphQLString),
    // },
    // chanceCountries: {
    //   type: new GraphQLNonNull(new GraphQLList(enumTypes.countryTypeEnum)),
    // },
    // dateOfBirth: {
    //   type: new GraphQLNonNull(GraphQLFloat),
    // },
    // phone: {
    //   type: new GraphQLNonNull(GraphQLString),
    // },
    // token: {
    //   type: GraphQLString,
    // },
  },
});

exports.testType = testType;
