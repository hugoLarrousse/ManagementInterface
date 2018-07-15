const {
  GraphQLNonNull,
  GraphQLString,
} = require('graphql');
const type = require('../types');
const { createResolver } = require('../utils');
const licence = require('../resolvers/licence');


exports.updateExpirationDate = {
  description: ('Update Expiration Date Licence'),
  type: type.licence.update,
  args: {
    orgaId: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'organisation Id',
    },
    expirationDate: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'timestamp expiration Date',
    },
  },
  resolve: createResolver({ isAuthRequired: false }, (_, args) => {
    return licence.updateExpirationDate(args);
  }),
};
