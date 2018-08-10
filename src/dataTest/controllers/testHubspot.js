const hubspot = require('../services/hubspot/getdatas');
const h7Echoes = require('../services/heptaward/echoes');
const h7Users = require('../services/heptaward/user');
const h7Controls = require('../services/controls/heptaward/echoes');
const hubspotControls = require('../services/controls/hubspot');
const srvDate = require('../Utils/dates');
const hubspotUtils = require('../Utils/hubspot');

const isTokenValid = (expirationDate) => Date.now() - 300000 < Number(expirationDate);

const compareDeals = async (email, period) => {
  const user = await h7Users.getUser(email);
  const integration = await h7Users.getIntegration(user._id, 'Hubspot');

  let integrationChecked = integration;
  if (integration.refreshToken && !isTokenValid(integration.tokenExpiresAt)) {
    integrationChecked = await hubspotUtils.refreshToken(integration);
  }

  const since = srvDate.timestampStartPeriode(period);

  const hubspotDealsOpened = await hubspot.getDealsOpened(integrationChecked.token, since);
  const hubspotDealsWon = await hubspot.getDealsWon(integrationChecked.token, since);

  const heptawardWonDeals = await h7Echoes.getDealsInfos('deal-won', user.team_id, since);
  const heptawardOpenedDeals = await h7Echoes.getDealsInfos('deal-opened', user.team_id, since);

  const dealsWonDoublons = await h7Controls.doublonsOnEchoes(heptawardWonDeals.deals);
  const dealsOpenedDoublons = await h7Controls.doublonsOnEchoes(heptawardOpenedDeals.deals);

  const unregisteredDealsWon = await hubspotControls.dealsNotRegistered(hubspotDealsWon, heptawardWonDeals.deals);
  const unregisteredDealsOpened = await hubspotControls.dealsNotRegistered(hubspotDealsOpened, heptawardOpenedDeals.deals);

  const differenceOpened = heptawardOpenedDeals.ndDeals - hubspotDealsOpened.length;
  const differenceWon = heptawardWonDeals.ndDeals - hubspotDealsWon.length;

  return {
    differences: {
      differenceOpened,
      differenceWon,
      doublons: (dealsOpenedDoublons.length + dealsWonDoublons.length),
      unRegistered: (unregisteredDealsOpened.length + unregisteredDealsWon.length),
    },
    hubspotOpened: {
      count: hubspotDealsOpened.length,
      datas: hubspotDealsOpened,
    },
    hubspotWon: {
      count: hubspotDealsWon.length,
      datas: hubspotDealsWon,
    },
    heptawardOpenedDeals,
    heptawardWonDeals,
    unregisteredDealsWon,
    unregisteredDealsOpened,
    dealsOpenedDoublons,
    dealsWonDoublons,
  };
};

const compareActivities = async (email, period) => {
  const user = await h7Users.getUser(email);
  const integration = await h7Users.getIntegration(user._id, 'Hubspot');

  let integrationChecked = integration;
  if (integration.refreshToken && !isTokenValid(integration.tokenExpiresAt)) {
    integrationChecked = await hubspotUtils.refreshToken(integration);
  }

  const since = srvDate.timestampStartPeriode(period);
  const hubspotengagements = await hubspot.getEngagements(integrationChecked.token, since);
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
    differences: {
      meetings: (heptawardMeetings.ndActivities - hubspotengagements.nbMeetings),
      meetingsDoublons: meetingsDoublons.length,
      meetingsUnregistered: unregisteredMeetingsEngagement.length,
      calls: (heptawardCalls.ndActivities - hubspotengagements.nbCalls),
      callsDoublons: callsDoublons.length,
      callsUnregistered: unregisteredCallsEngagement.length,
    },
    hubspotMeetings: {
      ndActivities: hubspotengagements.nbMeetings,
    },
    hubspotCalls: {
      ndActivities: hubspotengagements.nbCalls,
    },
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
