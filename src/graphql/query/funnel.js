const type = require('../types');
const funnel = require('../resolvers/funnel');
const { createResolver } = require('../utils');

exports.count = {
  type: type.funnel.count,
  description: 'Analytics about funnels',
  resolve: createResolver(
    { isAuthRequired: true },
    () => {
      return funnel.count();
    }
  ),
};
