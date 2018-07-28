const pipedrive = require('../services/pipedrive/pipedrive');
const h7Echoes = require('../services/heptaward/echoes');
const h7Users = require('../services/heptaward/user');
const PidControls = require('../services/controls/pipedrive');
const H7Controls = require('../services/controls/heptaward/echoes');

//
const compareMonthDeals = async (email) => {
  const user = await h7Users.getUser(email);

  const integration = await h7Users.getIntegration(user._id, 'Pipedrive');

  const pipedriveOpenedDeals = await pipedrive.getDealsOpenedTimeline(integration.token, Date.now(), 'month');
  const pipedriveWonDeals = await pipedrive.getDealsWonTimeline(integration.token, Date.now(), 'month');
  const heptawardOpenedDeals = await h7Echoes.getDealsInfos('deal-opened', user.team_id);
  const heptawardWonDeals = await h7Echoes.getDealsInfos('deal-won', user.team_id);

  const unRegisteredOpenedDeals = PidControls.notRegistered(pipedriveOpenedDeals[0].deals, heptawardOpenedDeals.deals);
  const unRegisteredWonDeals = PidControls.notRegistered(pipedriveWonDeals[0].deals, heptawardWonDeals.deals);

  const openedDoublons = H7Controls.doublonsOnEchoes(heptawardOpenedDeals.deals);
  const wonDoublons = H7Controls.doublonsOnEchoes(heptawardWonDeals.deals);

  return {
    differences: {
      opened: (heptawardOpenedDeals.ndDeals - pipedriveOpenedDeals[0].totals.count),
      won: (heptawardWonDeals.ndDeals - pipedriveWonDeals[0].totals.count),
      doublons: (openedDoublons.length + wonDoublons.length),
      unRegistered: (unRegisteredOpenedDeals.length + unRegisteredWonDeals.length),
    },
  };
};

const compareMonthActivities = async (email) => {
  const user = await h7Users.getUser(email);
  const integration = await h7Users.getIntegration(user._id, 'Pipedrive');

  const pipedriveMeetings = await pipedrive.getAddActivities('meeting', integration.token);
  const pipedriveCalls = await pipedrive.getAddActivities('call', integration.token);

  const heptawardMeetings = await h7Echoes.getAddActivitiesInfos('meeting', user.team_id);
  const heptawardCalls = await h7Echoes.getAddActivitiesInfos('call', user.team_id);

  const meetingsDoublons = await H7Controls.doublonsOnEchoes(heptawardMeetings.activities);
  const callsDoublons = await H7Controls.doublonsOnEchoes(heptawardCalls.activities);

  const meetingsUnregistered = await PidControls.notRegistered(pipedriveMeetings, heptawardMeetings.activities);
  const callsUnregistered = await PidControls.notRegistered(pipedriveCalls, heptawardCalls.activities);

  return {
    differences: {
      meetings: (heptawardMeetings.ndActivities - pipedriveMeetings.length),
      meetingsDoublons: meetingsDoublons.length,
      meetingsUnregistered: meetingsUnregistered.length,
      calls: (heptawardCalls.ndActivities - pipedriveCalls.length),
      callsDoublons: callsDoublons.length,
      callsUnregistered: callsUnregistered.length,
    },
  };
};

exports.compareMonthDeals = compareMonthDeals;
exports.compareMonthActivities = compareMonthActivities;
