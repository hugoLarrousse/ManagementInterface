const type = require('../types');
const dataTest = require('../resolvers/dataTest');
const { createResolver } = require('../utils');

exports.manual = {
  type: type.dataTest.manual,
  description: 'Test data',
  resolve: createResolver(
    { isAuthRequired: true },
    () => {
      return dataTest.manual();
    }
  ),
};
