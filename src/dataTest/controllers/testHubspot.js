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
  const hubspotDealsWon = await hubspot.getDealsWon(integrationChecked.token, since, allIntegrations);
  // console.log('hubspotDealsWon[0] :', hubspotDealsWon[0]);
  const heptawardWonDeals = await h7Echoes.getDealsInfos('deal-won', user.team_id, since, integrationChecked.integrationTeam);
  // console.log('heptawardWonDeals :', heptawardWonDeals);
  const heptawardOpenedDeals = await h7Echoes.getDealsInfos('deal-opened', user.team_id, since, integrationChecked.integrationTeam);

  const dealsWonDoublons = await h7Controls.doublonsOnEchoes(heptawardWonDeals.deals);
  const dealsOpenedDoublons = await h7Controls.doublonsOnEchoes(heptawardOpenedDeals.deals);

  const unregisteredDealsWon = await hubspotControls.dealsNotRegistered(hubspotDealsWon, heptawardWonDeals.deals);
  const unregisteredDealsOpened = await hubspotControls.dealsNotRegistered(hubspotDealsOpened, heptawardOpenedDeals.deals);

  const differenceOpened = heptawardOpenedDeals.ndDeals - hubspotDealsOpened.length;
  const differenceWon = heptawardWonDeals.ndDeals - hubspotDealsWon.length;

  const hubspotM = hubspotDealsOpened.map(p => p.dealId);
  // console.log('hubspotM :', hubspotM);
  const h7M = heptawardOpenedDeals.deals.map(p => p.source.id);
  // console.log('DIFFF :', difference(h7M, hubspotM));
  // const hubspotC = hubspotCalls.map(p => p.engagement.id);
  // const h7C = heptawardCalls.map(p => p.source.id);

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

const compareActivities = async (user, integrationChecked, allIntegrations, period) => {
  const since = srvDate.timestampStartPeriod(period);

  const hubspotengagements = await hubspot.getEngagements(integrationChecked.token, since, allIntegrations);

  const hubspotMeetings = hubspotengagements.documents.filter(meeting => meeting.engagement.type === 'MEETING');
  const hubspotCalls = hubspotengagements.documents.filter(meeting => meeting.engagement.type === 'CALL');

  const heptawardMeetings = await h7Echoes.getAddActivitiesInfos('meeting', user.team_id, since);
  const heptawardCalls = await h7Echoes.getAddActivitiesInfos('call', user.team_id, since);

  const unregisteredMeetingsEngagement = hubspotControls.engagementsNotRegistered(hubspotMeetings, heptawardMeetings);
  const unregisteredCallsEngagement = hubspotControls.engagementsNotRegistered(hubspotCalls, heptawardCalls);

  const meetingsDoublons = h7Controls.doublonsOnEchoes(heptawardMeetings);
  const callsDoublons = h7Controls.doublonsOnEchoes(heptawardCalls);
  const doublons = h7Controls.doublonsOnEchoes([...heptawardCalls, ...heptawardMeetings]);

  if (heptawardMeetings.length - hubspotengagements.nbMeetings > 0 || heptawardCalls.length - hubspotengagements.nbCalls > 0) {
    const hubspotM = hubspotMeetings.map(p => p.engagement.id);
    const h7M = heptawardMeetings.map(p => p.source.id);
    const hubspotC = hubspotCalls.map(p => p.engagement.id);
    const h7C = heptawardCalls.map(p => p.source.id);
    const idsToDelete = await hubspot.checkEngagements(integrationChecked.token, [...difference(h7M, hubspotM), ...difference(h7C, hubspotC)]);
    if (idsToDelete && idsToDelete.length > 0) {
      const heptawardActivityToDelete = [...heptawardMeetings, ...heptawardCalls].filter(activity => idsToDelete.includes(activity.source.id));
      h7Delete.deleteActivitiesById(heptawardActivityToDelete.map(a => a._id));
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
