const hubspot = require('../services/hubspot/getdatas');
const h7Echoes = require('../services/heptaward/echoes');
const h7Users = require('../services/heptaward/user');
const h7Controls = require('../services/controls/heptaward/echoes');
const hubspotControls = require('../services/controls/hubspot');
const srvDate = require('../Utils/dates');

const compareDeals = async (email, period) => {
  const user = await h7Users.getUser(email);
  const integration = await h7Users.getIntegration(user._id, 'Hubspot');

  const since = srvDate.timestampStartPeriode(period);

  const hubspotDealsOpened = await hubspot.getDealsOpened(integration.token, since);
  const hubspotDealsWon = await hubspot.getDealsWon(integration.token, since);

  const heptawardWonDeals = await h7Echoes.getDealsInfos('deal-won', user.team_id, since);
  const heptawardOpenedDeals = await h7Echoes.getDealsInfos('deal-opened', user.team_id, since);

  const dealsWonDoublons = await h7Controls.doublonsOnEchoes(heptawardWonDeals.deals);
  const dealsOpenedDoublons = await h7Controls.doublonsOnEchoes(heptawardOpenedDeals.deals);

  const unregisteredDealsWon = await hubspotControls.dealsNotRegistered(hubspotDealsWon, heptawardWonDeals.deals);
  const unregisteredDealsOpened = await hubspotControls.dealsNotRegistered(hubspotDealsOpened, heptawardOpenedDeals.deals);

  return {
    nbHubspotDealsOpened: hubspotDealsOpened.length,
    nbH7DealsOpened: heptawardOpenedDeals.ndDeals,
    nbH7DealsWon: heptawardWonDeals.ndDeals,
    nbHubspotDealsWon: hubspotDealsWon.length,
    nbDealsWonDoublons: dealsWonDoublons.length,
    nbDealsOpenedDoublons: dealsOpenedDoublons.length,
    nbUnregisteredDealsWon: unregisteredDealsWon.length,
    nbUnregisteredDealsOpened: unregisteredDealsOpened.length,
    heptawardOpenedDeals,
    heptawardWonDeals,
    hubspotDealsOpened,
    hubspotDealsWon,
  };
};

const compareActivities = async (email, period) => {
  const user = await h7Users.getUser(email);
  const hubspotToken = await h7Users.getIntegrationToken(user._id, 'Hubspot');
  if (!hubspotToken) {
    throw new Error('No hubspot token');
  }
  const since = srvDate.timestampStartPeriode(period);
  const hubspotengagements = await hubspot.getEngagements(hubspotToken, since);
  const hubspotMeetings = hubspotengagements.documents.filter(meeting => meeting.engagement.type === 'MEETING');
  const hubspotCalls = hubspotengagements.documents.filter(meeting => meeting.engagement.type === 'CALL');

  const heptawardMeetings = await h7Echoes.getAddActivitiesInfos('meeting', user.team_id, since);
  const heptawardCalls = await h7Echoes.getAddActivitiesInfos('call', user.team_id, since);


  const unregisteredMeetingsEngagement = hubspotControls.engagementsNotRegistered(hubspotMeetings, heptawardMeetings.activities);
  const unregisteredCallsEngagement = hubspotControls.engagementsNotRegistered(hubspotCalls, heptawardCalls.activities);

  const meetingsDoublons = h7Controls.doublonsOnEchoes(heptawardMeetings.activities);
  const callsDoublons = h7Controls.doublonsOnEchoes(heptawardCalls.activities);

  return {
    since: new Date(since),
    nbSourceMeetings: hubspotengagements.nbMeetings,
    nbH7Meetings: heptawardMeetings.ndActivities,
    nbSourceCalls: hubspotengagements.nbCalls,
    nbH7Calls: heptawardCalls.ndActivities,
    hubspotengagements,
    heptawardMeetings,
    heptawardCalls,
    unregisteredMeetingsEngagement,
    unregisteredCallsEngagement,
    meetingsDoublons,
    callsDoublons,
  };
};

exports.compareDeals = compareDeals;
exports.compareActivities = compareActivities;
