const mongo = require('../../../db/mongo');
const date = require('../../Utils/dates');

const getOpenedDeals = async (teamId, since) => {
  try {
    const startDate = date.formatDateStartMonth(since);

    const stats = {
      ndDeals: 0,
      totalValueDeals: 0,
      deals: [],
    };

    const select = {
      team: teamId,
      add_time: {
        $gte: startDate,
      },
    };

    const result = await mongo.find('pipedrive', 'deals', select);

    result.forEach(deal => {
      stats.totalValueDeals += deal.value;
    });

    stats.ndDeals = result.length;
    stats.deals = result;

    return stats;
  } catch (e) {
    throw new Error(`${__filename}
      ${getOpenedDeals.name}
      ${e.message}`);
  }
};

const getWonDeals = async (teamId, since) => {
  try {
    const startDate = date.formatDateStartMonth(since);

    const stats = {
      ndDeals: 0,
      totalValueDeals: 0,
      deals: [],
    };

    const select = {
      team: teamId,
      close_time: {
        $ne: null,
        $gte: startDate,
      },
      status: 'won',
    };

    const result = await mongo.find('pipedrive', 'deals', select);
    result.forEach(deal => {
      stats.totalValueDeals += deal.value;
    });

    stats.ndDeals = result.length;
    stats.deals = result;

    return stats;
  } catch (e) {
    throw new Error(`${__filename}
      ${getWonDeals.name}
      ${e.message}`);
  }
};

const getAddActivities = async (type, teamId, since) => {
  try {
    const startDate = date.formatDateStartMonth(since);

    const select = {
      team: teamId,
      type,
      add_time: {
        $gte: startDate,
      },
    };

    const result = await mongo.find('pipedrive', 'activities', select);

    return result;
  } catch (e) {
    throw new Error(`${__filename}
      ${getAddActivities.name}
      ${e.message}`);
  }
};

const getDoneActivities = async (type, teamId, since) => {
  try {
    const endDate = date.formatDateEndMonth(since);

    const select = {
      team: teamId,
      type,
      due_date: {
        $lte: endDate,
      },
      done: true,
    };

    const result = await mongo.find('pipedrive', 'activities', select);

    return result;
  } catch (e) {
    throw new Error(`${__filename}
      ${getDoneActivities.name}
      ${e.message}`);
  }
};

const getAllDataByTeam = async (teamId, dataType) => {
  try {
    const query = {
      team: teamId,
    };
    return mongo.find('pipedrive', dataType, query);
  } catch (e) {
    throw new Error(`${__filename}
      ${getAllDataByTeam.name}
      ${e.message}`);
  }
};

exports.getOpenedDeals = getOpenedDeals;
exports.getWonDeals = getWonDeals;
exports.getAddActivities = getAddActivities;
exports.getDoneActivities = getDoneActivities;
exports.getAllDataByTeam = getAllDataByTeam;
