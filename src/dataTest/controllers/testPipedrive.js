const pipedrive = require('../services/pipedrive/pipedrive');
const h7Echoes = require('../services/heptaward/echoes');
const h7Users = require('../services/heptaward/user');
const PidControls = require('../services/controls/pipedrive');
const H7Controls = require('../services/controls/heptaward/echoes');
const srvDate = require('../Utils/dates');
const genericControls = require('../services/controls/heptaward/generic');

const compareDeals = async (email, period) => {
  const user = await h7Users.getUser(email);

  const integration = await h7Users.getIntegration(user._id, 'Pipedrive');

  const since = srvDate.timestampStartPeriode(period);

  const pipedriveOpenedDeals = await pipedrive.getDealsOpenedTimeline(integration.token, since, period);
  const pipedriveWonDeals = await pipedrive.getDealsWonTimeline(integration.token, since, period);
  const heptawardOpenedDeals = await h7Echoes.getDealsInfos('deal-opened', user.team_id, since);
  const heptawardWonDeals = await h7Echoes.getDealsInfos('deal-won', user.team_id, since);


  const unRegisteredOpenedDeals = PidControls.notRegistered(pipedriveOpenedDeals[0].deals, heptawardOpenedDeals.deals);
  const unRegisteredWonDeals = PidControls.notRegistered(pipedriveWonDeals[0].deals, heptawardWonDeals.deals);

  const openedDoublons = H7Controls.doublonsOnEchoes(heptawardOpenedDeals.deals);
  const wonDoublons = H7Controls.doublonsOnEchoes(heptawardWonDeals.deals);

  const differenceOpened = genericControls.tabDealsCompare(heptawardOpenedDeals.deals, pipedriveOpenedDeals[0].deals);
  const differenceWon = genericControls.tabDealsCompare(heptawardWonDeals.deals, pipedriveWonDeals[0].deals);

  return {
    differenceOpened: differenceOpened.difference,
    differenceWon: differenceWon.difference,
    doublons: (openedDoublons.length + wonDoublons.length),
    unRegistered: (unRegisteredOpenedDeals.length + unRegisteredWonDeals.length),
  };
};

const compareActivities = async (email, period) => {
  const user = await h7Users.getUser(email);
  const integration = await h7Users.getIntegration(user._id, 'Pipedrive');

  const since = srvDate.timestampStartPeriode(period);

  const pipedriveMeetings = await pipedrive.getAddActivities('meeting', integration.token, since);
  const pipedriveCalls = await pipedrive.getAddActivities('call', integration.token, since);

  const heptawardMeetings = await h7Echoes.getAddActivitiesInfos('meeting', user.team_id, since);
  const heptawardCalls = await h7Echoes.getAddActivitiesInfos('call', user.team_id, since);

  const meetingsDoublons = await H7Controls.doublonsOnEchoes(heptawardMeetings.activities);
  const callsDoublons = await H7Controls.doublonsOnEchoes(heptawardCalls.activities);

  const meetingsUnregistered = await PidControls.notRegistered(pipedriveMeetings, heptawardMeetings.activities);
  const callsUnregistered = await PidControls.notRegistered(pipedriveCalls, heptawardCalls.activities);

  return {
    meetings: (heptawardMeetings.ndActivities - pipedriveMeetings.length),
    meetingsDoublons: meetingsDoublons.length,
    meetingsUnregistered: meetingsUnregistered.length,
    calls: (heptawardCalls.ndActivities - pipedriveCalls.length),
    callsDoublons: callsDoublons.length,
    callsUnregistered: callsUnregistered.length,
  };
};

exports.compareDeals = compareDeals;
exports.compareActivities = compareActivities;
