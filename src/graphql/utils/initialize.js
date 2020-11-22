const subscription = require('../resolvers/subscription');
const funnel = require('../resolvers/funnel');

module.exports = () => {
  subscription.initializeCount();
  funnel.initializeCount();
};
