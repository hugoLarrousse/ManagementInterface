const {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLFloat,
  GraphQLString,
  GraphQLEnumType,
  GraphQLBoolean,
} = require('graphql');

const { makeEnumType } = require('../utils');

const statusEnumType = new GraphQLEnumType({
  name: 'STATUS_TYPES',
  values: makeEnumType(['online', 'pause', 'offline', 'error']),
});

const channel = new GraphQLObjectType({
  name: 'channelType',
  fields: {
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    hours: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
});

exports.data = new GraphQLObjectType({
  name: 'dataPi',
  fields: {
    id: {
      type: new GraphQLNonNull(GraphQLString),
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    version: {
      type: GraphQLString,
    },
    company: {
      type: GraphQLString,
    },
    reloadCounter: {
      type: GraphQLFloat,
    },
    currentChannelName: {
      type: GraphQLString,
    },
    dayHour: {
      type: GraphQLString,
    },
    nextChannel: {
      type: channel,
    },
    cec: {
      type: GraphQLBoolean,
    },
    statusPi: {
      type: GraphQLBoolean,
    },
    statusCast: {
      type: GraphQLBoolean,
    },
    shouldHaveChannel: {
      type: GraphQLBoolean,
    },
    status: {
      type: new GraphQLNonNull(statusEnumType),
    },
    serial: {
      type: new GraphQLNonNull(GraphQLString),
    },
    teamId: {
      type: new GraphQLNonNull(GraphQLString),
    },
    alert: {
      type: GraphQLBoolean,
    },
  },
});

exports.logs = new GraphQLObjectType({
  name: 'logsPi',
  fields: {
    message: {
      type: GraphQLString,
    },
    type: {
      type: new GraphQLNonNull(GraphQLString),
    },
    createdAt: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
});

exports.reboot = new GraphQLObjectType({
  name: 'rebootPi',
  fields: {
    done: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
  },
});

exports.reload = new GraphQLObjectType({
  name: 'reloadPi',
  fields: {
    done: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
  },
});

exports.alert = new GraphQLObjectType({
  name: 'alertPi',
  fields: {
    done: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
  },
});
