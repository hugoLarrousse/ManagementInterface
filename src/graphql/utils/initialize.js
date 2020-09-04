const subscription = require('../resolvers/subscription');
const funnel = require('../resolvers/funnel');
const integration = require('../resolvers/integration');

module.exports = () => {
  subscription.initializeCount();
  funnel.initializeCount();
  integration.initializeData();
};
