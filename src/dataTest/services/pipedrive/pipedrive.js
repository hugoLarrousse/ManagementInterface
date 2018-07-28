const { get } = require('../../Utils/pipedrive');
const dates = require('../../Utils/dates');

//
const getDealsOpenedTimeline = async (apiToken, since, interval) => {
  try {
    const date = dates.formatDateStartMonth(since);

    const path = `/v1/deals/timeline?start_date=${date}&limit=500&interval=${interval}&amount=1&field_key=add_time`;

    const result = await get(path, apiToken);

    return result.data;
  } catch (e) {
    throw new Error(`${__filename}
      ${getDealsOpenedTimeline.name}
      ${e.message}`);
  }
};

//
const getDealsWonTimeline = async (apiToken, since, interval) => {
  try {
    const date = dates.formatDateStartMonth(since);
    const path = `/v1/deals/timeline?start_date=${date}&limit=500&interval=${interval}&amount=1&field_key=won_time`;

    const result = await get(path, apiToken);
    return result.data;
  } catch (e) {
    throw new Error(`${__filename}
      ${getDealsWonTimeline.name}
      ${e.message}`);
  }
};

const getAddActivities = async (type, apiToken, since) => {
  try {
    const compareStartDate = new Date(since);
    let hasMore = false;
    const activities = [];

    let path = `/v1/activities?user_id=0&limit=500&type=${type}&start=0&sort=add_time%20DESC`;

    do {
      const result = await get(path, apiToken);
      hasMore = result.additional_data.pagination.more_items_in_collection;
      result.data.forEach(activity => {
        const activityAddTime = new Date(activity.add_time);
        if (activityAddTime > compareStartDate) {
          activities.push(activity);
        } else {
          hasMore = false;
        }
      });
      path = `/v1/activities?user_id=0&limit=500&type=${type}&start=${result.additional_data.pagination.next_start}&sort=add_time%20DESC`;
    } while (hasMore);

    return activities;
  } catch (e) {
    throw new Error(`${__filename}
      ${getAddActivities.name}
      ${e.message}`);
  }
};

const getDoneActivities = async (type, apiToken, since) => {
  try {
    const compareStartDate = new Date(since);
    let hasMore = false;
    const activities = [];

    let path = `/v1/activities?user_id=0&limit=500&type=${type}&start=0&sort=due_date%20DESC`;

    do {
      const result = await get(path, apiToken);
      hasMore = result.additional_data.pagination.more_items_in_collection;
      result.data.forEach(activity => {
        const activityDueTime = new Date(activity.due_date);
        if (activityDueTime > compareStartDate) {
          activities.push(activity);
        } else {
          hasMore = false;
        }
      });
      path = `/v1/activities?user_id=0&limit=500&type=${type}&start=${result.additional_data.pagination.next_start}&sort=due_date%20DESC`;
    } while (hasMore);

    return activities;
  } catch (e) {
    throw new Error(`${__filename}
      ${getDoneActivities.name}
      ${e.message}`);
  }
};

exports.getDealsOpenedTimeline = getDealsOpenedTimeline;
exports.getDealsWonTimeline = getDealsWonTimeline;
exports.getAddActivities = getAddActivities;
exports.getDoneActivities = getDoneActivities;