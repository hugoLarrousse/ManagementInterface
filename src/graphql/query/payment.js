const { GraphQLList } = require('graphql');

const type = require('../types');
const payment = require('../resolvers/payment');
const { createResolver } = require('../utils');

exports.count = {
  type: type.payment.count,
  description: 'Analytics about users',
  resolve: createResolver(
    { isAuthRequired: true },
    () => {
      return payment.count();
    }
  ),
};

exports.getCoupons = {
  type: new GraphQLList(type.payment.coupons),
  description: 'Get All coupons',
  resolve: createResolver(
    { isAuthRequired: true },
    () => {
      return payment.getCoupons();
    }
  ),
};
