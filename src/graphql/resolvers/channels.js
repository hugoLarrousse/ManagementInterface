const requestRetry = require('requestretry');
const { ObjectID } = require('mongodb');

const mongo = require('../../db/mongo');

const { socketUrl } = process.env;

const optionsGetInfo = {
  url: `${socketUrl}/channels`,
  method: 'GET',
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
    Authorization: process.env.fixedTokenPi,
  },
  json: true,
};


exports.getChannelsLive = async () => {
  try {
    const { error, body } = await requestRetry(optionsGetInfo);
    if (error || body.error || !body.channels) {
      console.log('error :', error || body.error);
      return { error: true };
    }
    const { channels } = body;
    const teamIds = [...new Set(channels.map(channel => ObjectID(channel.teamId)))];
    const teams = await mongo.find('heptaward', 'teams', { _id: { $in: teamIds } });
    return teams.map(team => {
      const teamChannels = channels.filter(c => c.teamId === String(team._id));
      const countChannels = teamChannels.reduce((prev, curr) => {
        const index = prev.findIndex(p => p.id === curr._id);
        if (index === -1) {
          prev.push({
            id: curr._id,
            name: curr.name,
            count: 1,
          });
        } else {
          prev[index] = { ...prev[index], count: prev[index].count + 1 }; // eslint-disable-line
        }
        return prev;
      }, []);
      return {
        id: team._id,
        name: team.name,
        countChannels,
      };
    });
  } catch (e) {
    console.log('ERROR getChannelsLive', e);
    return {};
  }
};
