const type = require('../types');
const channels = require('../resolvers/channels');
const { createResolver } = require('../utils');

const { GraphQLList } = require('graphql');

exports.channelsLiveQuery = {
  type: new GraphQLList(type.channels.channelLive),
  description: 'get channels live',
  resolve: createResolver(
    { isAuthRequired: true },
    () => {
      return channels.getChannelsLive();
    }
  ),
};
