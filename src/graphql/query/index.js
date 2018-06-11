const {
  GraphQLObjectType,
} = require('graphql');

const authentication = require('./authentication');
const user = require('./user');
const subscription = require('./subscription');
const payment = require('./payment');
const integration = require('./integration');
const funnel = require('./funnel');
const list = require('./list');

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    getOneUser: user.getOneUserQuery,
    jwtLogin: authentication.jwtLoginQuery,
    subscriptionInfo: subscription.count,
    paymentInfo: payment.count,
    integrationInfo: integration.count,
    funnelInfo: funnel.count,
    listInfo: list.info,
  },
});

exports.queryType = queryType;
