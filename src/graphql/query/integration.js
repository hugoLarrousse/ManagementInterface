const type = require('../types');
const integration = require('../resolvers/integration');
const { createResolver } = require('../utils');

exports.count = {
  type: type.integration.count,
  description: 'Analytics about integrations',
  resolve: createResolver(
    { isAuthRequired: true },
    () => {
      return integration.count();
    }
  ),
};
