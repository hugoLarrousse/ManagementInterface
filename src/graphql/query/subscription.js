const type = require('../types');
const subscription = require('../resolvers/subscription');
const { createResolver } = require('../utils');

exports.count = {
  type: type.subscription.count,
  description: 'Analytics about users',
  resolve: createResolver(
    { isAuthRequired: true },
    () => {
      return subscription.count();
    }
  ),
};
