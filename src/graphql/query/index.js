const {
  GraphQLObjectType,
} = require('graphql');

const authentication = require('./authentication');
const user = require('./user');
const subscription = require('./subscription');
const payment = require('./payment');

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    getOneUser: user.getOneUserQuery,
    jwtLogin: authentication.jwtLoginQuery,
    subscriptionInfo: subscription.count,
    paymentInfo: payment.count,
  },
});

exports.queryType = queryType;
