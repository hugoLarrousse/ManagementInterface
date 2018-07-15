const {
  GraphQLObjectType,
} = require('graphql');

const licence = require('./licence');

const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    updateLicenceExpirationDate: licence.updateExpirationDate,
  },
});

exports.mutationType = mutationType;
