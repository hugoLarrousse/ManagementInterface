const mongo = require('../../Utils/mongo');

const getOpenedDeals = async (teamId, since, stages) => {
  try {

    const stats = {
      ndDeals: 0,
      totalValueDeals: 0,
      deals: [],
    }

    const select = {
      portalId: teamId,
      isDeleted: false,
      'properties.createdate.value': {
        $gte: since.toString(),
      },
    };

    const result = await mongo.find('hubspot', 'deals', select);


    result.forEach(deal => {
      if (deal.properties.amout) {
        stats.totalValueDeals += Number(deal.properties.amout.value);
      }
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

const getWonDeals = async (teamId, since, stages) => {
  try {

    const stats = {
      ndDeals: 0,
      totalValueDeals: 0,
      deals: [],
    }

    const select = {
      portalId: teamId,
      isDeleted: false,
      'properties.closedate.value': {
        $gte: since.toString(),
      },
      'properties.dealstage.value': {
        $in: stages.won,
      }
    }

    const result = await mongo.find('hubspot', 'deals', select);

    result.forEach(deal => {
      if (deal.properties.closed_won_reason) {
        stats.deals.push(deal);
        if (deal.properties.amout) {
          stats.totalValueDeals += Number(deal.properties.amout.value);
        }
      };
    });

    stats.ndDeals = stats.deals.length;

    return stats;
  } catch (e) {
    throw new Error(`${__filename}
      ${getWonDeals.name}
      ${e.message}`);
  }
};

const getEngagementsDone = async (teamId, since) => {
  try {
    let documents = [];
    let nbMeetings = 0;
    let nbCalls = 0;

    let stats = {
      ndDeals: 0,
      totalValueDeals: 0,
      deals: [],
    }

    const select = {
      "engagement.portalId": teamId,
      "engagement.active": true,
      "engagement.timestamp": {
        $gte: since
      },
    }

    const result = await mongo.find('hubspot', 'engagements', select);

    result.forEach(element => {
      if (element.engagement.type === 'MEETING' || element.engagement.type === 'CALL') {
        if (element.engagement.type === 'MEETING') {
          nbMeetings += 1;
        }
        if (element.engagement.type === 'CALL') {
          nbCalls += 1;
        }
        documents.push(element);
      };
    });

    return {
      nbMeetings,
      nbCalls,
      documents,
    };
  } catch (e) {
    throw new Error(`${__filename}
      ${getEngagementsDone.name}
      ${e.message}`);
  }
};

const getEngagementsAdd = async (teamId, since) => {
  try {
    let documents = [];
    let nbMeetings = 0;
    let nbCalls = 0;

    const select = {
      "engagement.portalId": teamId,
      "engagement.active": true,
      "engagement.createdAt": {
        $gte: since,
      },
    }

    const result = await mongo.find('hubspot', 'engagements', select);
    result.forEach(element => {
      if (element.engagement.type === 'MEETING' || element.engagement.type === 'CALL') {
        if (element.engagement.type === 'MEETING') {
          nbMeetings += 1;
        }
        if (element.engagement.type === 'CALL') {
          nbCalls += 1;
        }
        documents.push(element);
      };
    });

    return {
      nbMeetings,
      nbCalls,
      documents,
    };
  } catch (e) {
    throw new Error(`${__filename}
      ${getEngagementsAdd.name}
      ${e.message}`);
  }
};


exports.getOpenedDeals = getOpenedDeals;
exports.getWonDeals = getWonDeals;
exports.getEngagementsDone = getEngagementsDone;
exports.getEngagementsAdd = getEngagementsAdd;