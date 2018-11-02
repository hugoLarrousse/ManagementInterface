const {
  GraphQLObjectType,
} = require('graphql');

const licence = require('./licence');
const user = require('./user');

const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    updateLicenceExpirationDate: licence.updateExpirationDate,
    deleteUsers: user.deleteUsers,
  },
});

exports.mutationType = mutationType;
