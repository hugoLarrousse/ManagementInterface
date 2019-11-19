const {
  GraphQLNonNull,
  GraphQLString,
} = require('graphql');
const type = require('../types');
const { createResolver } = require('../utils');
const pi = require('../resolvers/pi');


exports.rebootPi = {
  description: 'reboot a pi',
  type: type.pi.reboot,
  args: {
    serial: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'serial',
    },
  },
  resolve: createResolver({ isAuthRequired: false }, (_, args) => {
    return pi.reboot(args);
  }),
};

exports.reloadPi = {
  description: 'reload a pi',
  type: type.pi.reload,
  args: {
    teamId: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'teamId',
    },
    deviceId: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'deviceId',
    },
  },
  resolve: createResolver({ isAuthRequired: false }, (_, args) => {
    return pi.reload(args);
  }),
};
