const { get } = require('../../Utils/pipedrive');

const getDealsOpenedTimeline = async (apiToken, since, isOauth, allIntegrations, pipelines) => {
  try {
    const integrationIds = allIntegrations.map(int => int.integrationId);

    let hasMore = false;
    const deals = [];

    let path = `${isOauth ? '' : '/v1'}/deals?user_id=0&start=0&limit=500&sort=add_time%20DESC`;

    do {
      const result = await get(path, apiToken, isOauth);
      if (!result.data) {
        return [];
      }

      hasMore = result.additional_data && result.additional_data.pagination.more_items_in_collection;
      result.data = result.data.filter(d => integrationIds.includes(Number(d.user_id.id)));

      if (pipelines && pipelines.length > 0) {
        result.data = result.data.filter(r => {
          return pipelines.includes(r.pipeline_id);
        });
      }

      result.data.forEach(deal => { //eslint-disable-line
        const dealAddTime = new Date(deal.add_time).getTime();

        if (dealAddTime > since) {
          deals.push(deal);
        } else {
          hasMore = false;
        }
      });
      if (hasMore) {
        path = `${isOauth ? '' : '/v1'}/deals?limit=500&sort=add_time%20DESC&start=${result.additional_data.pagination.next_start}`; //eslint-disable-line
      }
    } while (hasMore);

    return deals;
  } catch (e) {
    throw new Error(`${__filename}
      ${getDealsOpenedTimeline.name}
      ${e.message}`);
  }
};

exports.getDealsWonTimeline = async (apiToken, since, isOauth, allIntegrations, pipelines) => {
  try {
    const integrationIds = allIntegrations.map(int => int.integrationId);

    let hasMore = false;
    const deals = [];

    let path = `${isOauth ? '' : '/v1'}/deals?limit=500&sort=won_time%20DESC&status=won`;

    do {
      const result = await get(path, apiToken, isOauth);

      if (!result.data) {
        return [];
      }
      hasMore = result.additional_data && result.additional_data.pagination.more_items_in_collection;
      result.data = result.data.filter(d => integrationIds.includes(Number(d.user_id.id)));

      if (pipelines && pipelines.length > 0) {
        result.data = result.data.filter(r => {
          return pipelines.includes(r.pipeline_id);
        });
      }

      result.data.forEach(deal => { //eslint-disable-line
        const dealWonTime = new Date(deal.won_time).getTime();

        if (dealWonTime > since) {
          deals.push(deal);
        } else {
          hasMore = false;
        }
      });
      if (hasMore) {
        path = `${isOauth ? '' : '/v1'}/deals?limit=500&sort=won_time%20DESC&start=${result.additional_data.pagination.next_start}&status=won`; //eslint-disable-line
      }
    } while (hasMore);

    return deals;
  } catch (e) {
    throw new Error(`${__filename}
      getDealsWonTimeline
      ${e.message}`);
  }
};

const getAddActivities = async (type, apiToken, since, isOauth, allIntegrations, pipelines, needActivitiesNoDeal) => {
  try {
    const integrationIds = allIntegrations.map(int => int.integrationId);
    let hasMore = false;
    let activities = [];

    let path = `${isOauth ? '' : '/v1'}/activities?user_id=0&limit=500&type=${type}&start=0&sort=add_time%20DESC`;

    do {
      const result = await get(path, apiToken, isOauth);
      if (!result.data) {
        return [];
      }
      hasMore = result.additional_data && result.additional_data.pagination.more_items_in_collection;
      if (pipelines && pipelines.length > 0) {
        result.data = result.data.filter(activity => {
          if (!activity.deal_id || !result.related_objects.deal[activity.deal_id]) return needActivitiesNoDeal || false;
          return pipelines.includes(result.related_objects.deal[activity.deal_id].pipeline_id);
        });
      }
      const resultFiltered = result.data.filter(activity => type.includes(activity.type) && activity.done);
      if (resultFiltered.length === 0) {
        const lastActivity = result.data[0];
        const lastActivityAddTime = new Date(lastActivity.add_time).getTime();
        if (lastActivityAddTime < since) {
          hasMore = false;
        }
      }
      resultFiltered.forEach(activity => { //eslint-disable-line
        const activityAddTime = new Date(activity.add_time).getTime();
        if (activityAddTime > since) {
          activities.push(activity);
        } else {
          hasMore = false;
        }
      });
      if (hasMore) {
       path = `${isOauth ? '' : '/v1'}/activities?user_id=0&limit=500&type=${type}&start=${result.additional_data.pagination.next_start}&sort=add_time%20DESC`; //eslint-disable-line
      }
    } while (hasMore);

    activities = activities.filter(d => integrationIds.includes(Number(d.user_id)));
    return activities;
  } catch (e) {
    throw new Error(`${__filename}
      ${getAddActivities.name}
      ${e.message}`);
  }
};

const getDoneActivities = async (type, apiToken, since, isOauth) => {
  try {
    let hasMore = false;
    const activities = [];

    let path = `${isOauth ? '' : '/v1'}/activities?user_id=0&limit=500&type=${type}&start=0&sort=due_date%20DESC`;

    do {
      const result = await get(path, apiToken, isOauth);
      if (!result.data) {
        return [];
      }
      hasMore = result.additional_data && result.additional_data.pagination.more_items_in_collection;
      result.data.forEach(activity => { //eslint-disable-line
        const activityDueTime = new Date(activity.due_date).getTime();
        if (activityDueTime > since) {
          activities.push(activity);
        } else {
          hasMore = false;
        }
      });
      if (hasMore) {
       path = `${isOauth ? '' : '/v1'}/activities?user_id=0&limit=500&type=${type}&start=${result.additional_data.pagination.next_start}&sort=due_date%20DESC`; //eslint-disable-line
      }
    } while (hasMore);

    return activities;
  } catch (e) {
    throw new Error(`${__filename}
      ${getDoneActivities.name}
      ${e.message}`);
  }
};

exports.getDealById = (dealId, apiToken, isOauth) => {
  const path = `${isOauth ? '' : '/v1'}/deals/${dealId}`;
  return get(path, apiToken, isOauth);
};

exports.getDealsOpenedTimeline = getDealsOpenedTimeline;
exports.getAddActivities = getAddActivities;
exports.getDoneActivities = getDoneActivities;
