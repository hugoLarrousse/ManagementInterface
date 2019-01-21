const {
  GraphQLObjectType,
} = require('graphql');

const licence = require('./licence');
const user = require('./user');
const notification = require('./notification');

const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    updateLicenceExpirationDate: licence.updateExpirationDate,
    deleteUsers: user.deleteUsers,
    postNotification: notification.postNotification,
  },
});

exports.mutationType = mutationType;
