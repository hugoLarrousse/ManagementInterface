const mongo = require('../../../db/mongo');
const { ObjectID } = require('mongodb');
const Utils = require('../../../utils');

const getDealsInfos = async (type, teamH7Id, since, integrationTeam, crm) => {
  try {
    const stats = {
      ndDeals: 0,
      totalValueDeals: 0,
      deals: [],
    };

    const select = {
      team_h7_id: ObjectID(teamH7Id),
      user_h7_id: { $ne: null },
      'source.team_id': crm === 'salesforce' ? integrationTeam : Number(integrationTeam),
      'source.name': crm,
      date_add_timestamp: {
        $gte: Number(since) - (crm === 'pipedrive' ? 3600000 * 3 : 0),
        ...crm === 'hubspot' && { $lte: Date.now() },
      },
      type,
    };

    const result = await mongo.find('heptaward', Utils.typeToCollection[type], select);
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

const getAddActivitiesInfos = (type, teamId, since, crm) => {
  try {
    const select = {
      team_h7_id: ObjectID(teamId),
      user_h7_id: { $ne: null },
      'source.name': crm,
      date_add_timestamp: {
        $gte: Number(since) - (crm === 'pipedrive' ? 3600000 * 3 : 0),
        // $lte: Date.now(),
      },
      ...type === 'call' && { date_marked_done_timestamp: { $ne: null } },
    };

    return mongo.find('heptaward', Utils.typeToCollection[type], select);
  } catch (e) {
    throw new Error(`${__filename}
      ${getAddActivitiesInfos.name}
      ${e.message}`);
  }
};

// if usefull go change echoes
// const getDoneActivitiesInfos = async (type, teamId, since, crm) => {
//   try {
//     const stats = {
//       ndActivities: 0,
//       activities: [],
//     };

//     const select = {
//       team_h7_id: ObjectID(teamId),
//       user_h7_id: { $ne: null },
//       'source.name': crm,
//       date_done_timestamp: {
//         $gte: Number(since),
//       },
//       type,
//     };

//     const result = await mongo.find('heptaward', 'echoes', select);

//     stats.ndActivities = result.length;
//     stats.activities = result;

//     return stats;
//   } catch (e) {
//     throw new Error(`${__filename}
//       ${getDoneActivitiesInfos.name}
//       ${e.message}`);
//   }
// };

const getActivitiesDoublons = async (teamId, activityId, type) => {
  if (type) {
    return mongo.find(
      'heptaward',
      Utils.typeToCollection[type],
      { 'source.id': activityId, 'source.team_id': teamId, type: type || { $in: ['call', 'meeting'] } }
    );
  }
  const calls = await mongo.find('heptaward', Utils.typeToCollection.call, { 'source.id': activityId, 'source.team_id': teamId });
  const meetings = await mongo.find('heptaward', Utils.typeToCollection.meeting, { 'source.id': activityId, 'source.team_id': teamId });
  return [...calls, ...meetings];
};

// change echoes if needed
// const getDealsDoublons = (teamId, activityId, type) => {
//   return mongo.find('heptaward', 'echoes', { 'source.id': activityId, 'source.team_id': teamId, type });
// };

exports.deleteDoublonById = (id, type) => mongo.softDelete('heptaward', Utils.typeToCollection[type], { _id: ObjectID(id) });

exports.deleteDoublonsById = (ids, type) => mongo.softDeleteMany('heptaward', Utils.typeToCollection[type], { _id: { $in: ids } });

exports.softDelete = (query, type) => mongo.softDelete('heptaward', Utils.typeToCollection[type], query);

exports.getDealsInfos = getDealsInfos;
exports.getAddActivitiesInfos = getAddActivitiesInfos;
exports.getActivitiesDoublons = getActivitiesDoublons;
