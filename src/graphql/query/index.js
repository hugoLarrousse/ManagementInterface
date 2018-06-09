const {
  GraphQLObjectType,
} = require('graphql');

const authentication = require('./authentication');
const user = require('./user');
const subscription = require('./subscription');

const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: {
    getOneUser: user.getOneUserQuery,
    jwtLogin: authentication.jwtLoginQuery,
    subscriptionCount: subscription.count,
  },
});

exports.queryType = queryType;
