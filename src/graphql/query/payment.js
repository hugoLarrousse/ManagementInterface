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
