const {
  GraphQLObjectType,
} = require('graphql');

const licence = require('./licence');
const user = require('./user');
const notification = require('./notification');
const payment = require('./payment');
const pi = require('./pi');

const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    updateLicenceExpirationDate: licence.updateExpirationDate,
    deleteUsers: user.deleteUsers,
    postNotification: notification.postNotification,
    setCoupon: payment.setCoupon,
    rebootPi: pi.rebootPi,
    reloadPi: pi.reloadPi,
  },
});

exports.mutationType = mutationType;
