const type = require('../types');
const dataTest = require('../resolvers/dataTest');
const { createResolver } = require('../utils');

const {
  GraphQLNonNull,
  GraphQLString,
} = require('graphql');

exports.allData = {
  type: type.dataTest.allData,
  description: 'Test all data',
  resolve: createResolver(
    { isAuthRequired: true },
    () => {
      return dataTest.allData();
    }
  ),
};

exports.data = {
  type: type.dataTest.data,
  description: 'Test data',
  args: {
    email: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Email to check',
    },
    crmName: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Name of the crm',
    },
  },
  resolve: createResolver(
    { isAuthRequired: true },
    (_, args) => {
      return dataTest.data(args);
    }
  ),
};
