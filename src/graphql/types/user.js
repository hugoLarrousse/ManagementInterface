const {
  GraphQLString,
  GraphQLNonNull,
  GraphQLObjectType,
} = require('graphql');

exports.user = new GraphQLObjectType({
  name: 'User',
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
  },
});

