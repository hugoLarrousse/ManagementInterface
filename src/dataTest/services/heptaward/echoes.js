const mongo = require('../../../db/mongo');
const { ObjectID } = require('mongodb');

const getDealsInfos = async (type, teamH7Id, since, integrationTeam) => {
  try {
    const stats = {
      ndDeals: 0,
      totalValueDeals: 0,
      deals: [],
    };

    const select = {
      team_h7_id: ObjectID(teamH7Id),
      'source.team_id': Number(integrationTeam),
      date_add_timestamp: {
        $gte: Number(since) + 7200000,
      },
      type,
    };

    const result = await mongo.find('heptaward', 'echoes', select);
    result.forEach(deal => {
      stats.totalValueDeals += deal.parametres.valeur;
    });

    stats.ndDeals = result.length;
    stats.deals = result;

    return stats;
  } catch (e) {
    throw new Error(`${__filename}
      ${getDealsInfos.name}
      ${e.message}`);
  }
};

const getAddActivitiesInfos = async (type, teamId, since) => {
  try {
    const stats = {
      ndActivities: 0,
      activities: [],
    };

    const select = {
      team_h7_id: ObjectID(teamId),
      date_add_timestamp: {
        $gte: Number(since) + 7200000,
        $lte: 1538431080000,
      },
      type,
    };

    const result = await mongo.find('heptaward', 'echoes', select);

    stats.ndActivities = result.length;
    stats.activities = result;

    return stats;
  } catch (e) {
    throw new Error(`${__filename}
      ${getAddActivitiesInfos.name}
      ${e.message}`);
  }
};

const getDoneActivitiesInfos = async (type, teamId, since) => {
  try {
    const stats = {
      ndActivities: 0,
      activities: [],
    };

    const select = {
      team_h7_id: ObjectID(teamId),
      date_done_timestamp: {
        $gte: Number(since),
      },
      type,
    };

    const result = await mongo.find('heptaward', 'echoes', select);

    stats.ndActivities = result.length;
    stats.activities = result;

    return stats;
  } catch (e) {
    throw new Error(`${__filename}
      ${getDoneActivitiesInfos.name}
      ${e.message}`);
  }
};

exports.getDealsInfos = getDealsInfos;
exports.getAddActivitiesInfos = getAddActivitiesInfos;
exports.getDoneActivitiesInfos = getDoneActivitiesInfos;
