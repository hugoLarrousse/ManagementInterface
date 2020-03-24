const hubspot = require('../services/hubspot/getdatas');
const h7Echoes = require('../services/heptaward/echoes');
const h7Delete = require('../services/heptaward/delete');
const h7Controls = require('../services/controls/heptaward/echoes');
const hubspotControls = require('../services/controls/hubspot');
const srvDate = require('../Utils/dates');
const difference = require('lodash/difference');

const compareDeals = async (user, integrationChecked, allIntegrations, period) => {
  const since = srvDate.timestampStartPeriod(period);

  const hubspotDealsOpened = await hubspot.getDealsOpened(integrationChecked.token, since, allIntegrations);
  const hubspotWonDeals = await hubspot.getDealsWon(integrationChecked.token, since, allIntegrations);

  const heptawardWonDeals = await h7Echoes.getDealsInfos('deal-won', user.team_id, since, integrationChecked.integrationTeam, 'hubspot');
  const heptawardOpenedDeals = await h7Echoes.getDealsInfos('deal-opened', user.team_id, since, integrationChecked.integrationTeam, 'hubspot');

  const dealsWonDoublons = await h7Controls.doublonsOnEchoes(heptawardWonDeals.deals);
  const dealsOpenedDoublons = await h7Controls.doublonsOnEchoes(heptawardOpenedDeals.deals);

  const unregisteredDealsWon = await hubspotControls.dealsNotRegistered(hubspotWonDeals, heptawardWonDeals.deals);
  const unregisteredDealsOpened = await hubspotControls.dealsNotRegistered(hubspotDealsOpened, heptawardOpenedDeals.deals);

  const differenceOpened = heptawardOpenedDeals.ndDeals - hubspotDealsOpened.length;
  const differenceWon = heptawardWonDeals.ndDeals - hubspotWonDeals.length;

  // usefull to test diff deals won
  // const hubspotM = hubspotWonDeals.map(p => p.dealId);
  // console.log('hubspotM :', hubspotM.length);
  // const h7M = heptawardWonDeals.deals.map(p => p.source.id);
  // console.log('DIFFF :', difference(h7M, hubspotM));

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
      count: hubspotWonDeals.length,
      datas: hubspotWonDeals,
    },
    heptawardOpenedDeals,
    heptawardWonDeals,
    unregisteredDealsWon,
    unregisteredDealsOpened,
    dealsOpenedDoublons,
    dealsWonDoublons,
  };
};

const compareActivities = async (user, integrationChecked, allIntegrations, period) => {
  const since = srvDate.timestampStartPeriod(period);

  const hubspotEngagements = await hubspot.getEngagements(integrationChecked.token, since, allIntegrations);

  const hubspotMeetings = hubspotEngagements.documents.filter(meeting => meeting.engagement.type === 'MEETING');
  const hubspotCalls = hubspotEngagements.documents.filter(meeting => meeting.engagement.type === 'CALL');

  const heptawardMeetings = await h7Echoes.getAddActivitiesInfos('meeting', user.team_id, since, 'hubspot');
  const heptawardCalls = await h7Echoes.getAddActivitiesInfos('call', user.team_id, since, 'hubspot');

  const unregisteredMeetingsEngagement = hubspotControls.engagementsNotRegistered(hubspotMeetings, heptawardMeetings);
  const unregisteredCallsEngagement = hubspotControls.engagementsNotRegistered(hubspotCalls, heptawardCalls);

  const meetingsDoublons = h7Controls.doublonsOnEchoes(heptawardMeetings);
  const callsDoublons = h7Controls.doublonsOnEchoes(heptawardCalls);
  const doublons = h7Controls.doublonsOnEchoes([...heptawardCalls, ...heptawardMeetings]);

  if (heptawardMeetings.length - hubspotEngagements.nbMeetings > 0 || heptawardCalls.length - hubspotEngagements.nbCalls > 0) {
    const hubspotM = hubspotMeetings.map(p => p.engagement.id);
    const h7M = heptawardMeetings.map(p => p.source.id);
    const hubspotC = hubspotCalls.map(p => p.engagement.id);
    const h7C = heptawardCalls.map(p => p.source.id);
    const idsToDelete = await hubspot.checkEngagements(integrationChecked.token, [...difference(h7M, hubspotM), ...difference(h7C, hubspotC)]);
    if (idsToDelete && idsToDelete.length > 0) {
      const heptawardCallToDelete = heptawardCalls.filter(activity => idsToDelete.includes(activity.source.id));
      const heptawardMeetingToDelete = heptawardMeetings.filter(activity => idsToDelete.includes(activity.source.id));
      await h7Delete.deleteActivitiesById(heptawardCallToDelete.map(a => a._id), 'call');
      await h7Delete.deleteActivitiesById(heptawardMeetingToDelete.map(a => a._id), 'meeting');
    }
  }

  return {
    since: new Date(since),
    differences: {
      // meetings: heptawardMeetings.length - hubspotengagements.nbMeetings,
      meetingsDoublons: meetingsDoublons.length,
      meetingsUnregistered: unregisteredMeetingsEngagement.length,
      // calls: heptawardCalls.length - hubspotengagements.nbCalls,
      callsDoublons: callsDoublons.length,
      callsUnregistered: unregisteredCallsEngagement.length,
      doublons: doublons.length,
    },
    hubspotMeetings: {
      ndActivities: hubspotEngagements.nbMeetings,
    },
    hubspotCalls: {
      ndActivities: hubspotEngagements.nbCalls,
    },
    hubspotengagements: hubspotEngagements,
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
