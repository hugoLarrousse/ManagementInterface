const {
  GraphQLNonNull,
  GraphQLString,
  GraphQLBoolean,
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

exports.changeAlertPi = {
  description: 'change alert pi',
  type: type.pi.alert,
  args: {
    serial: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'serial',
    },
    alert: {
      type: GraphQLBoolean,
      description: 'alert',
    },
  },
  resolve: createResolver({ isAuthRequired: false }, (_, args) => {
    return pi.changeAlertPi(args);
  }),
};
