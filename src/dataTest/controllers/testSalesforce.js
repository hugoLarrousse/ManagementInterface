
const salesforce = require('../services/salesforce');
const h7Echoes = require('../services/heptaward/echoes');
const PidControls = require('../services/controls/pipedrive');
const H7Controls = require('../services/controls/heptaward/echoes');
const srvDate = require('../Utils/dates');
const genericControls = require('../services/controls/heptaward/generic');
// const difference = require('lodash/difference');


const compareDeals = async (user, integrationChecked, allIntegrations, period) => {
  const since = srvDate.timestampStartPeriod(period);

  const salesforceOpenedDeals = await salesforce.getDealsOpened(
    integrationChecked.token, integrationChecked.instanceUrl, period,
    allIntegrations, integrationChecked.restrictions
  );

  const salesforceWonDeals = await salesforce.getDealsWon(
    integrationChecked.token, integrationChecked.instanceUrl, since,
    allIntegrations, integrationChecked.restrictions
  );

  const heptawardOpenedDeals = await h7Echoes.getDealsInfos('deal-opened', user.team_id, since, integrationChecked.integrationTeam, 'salesforce');
  const heptawardWonDeals = await h7Echoes.getDealsInfos('deal-won', user.team_id, since, integrationChecked.integrationTeam, 'salesforce');

  const unRegisteredOpenedDeals = PidControls.notRegistered(salesforceOpenedDeals, heptawardOpenedDeals.deals);
  const unRegisteredWonDeals = PidControls.notRegistered(salesforceWonDeals, heptawardWonDeals.deals);

  const openedDoublons = H7Controls.doublonsOnEchoes(heptawardOpenedDeals.deals);
  const wonDoublons = H7Controls.doublonsOnEchoes(heptawardWonDeals.deals);

  const differenceOpened = genericControls.tabDealsCompare(heptawardOpenedDeals.deals, salesforceOpenedDeals);
  const differenceWon = genericControls.tabDealsCompare(heptawardWonDeals.deals, salesforceWonDeals);

  // const salesforceM = salesforceWonDeals.map(p => p.Id);
  // console.log('salesforceM :', salesforceM.length);
  // const h7M = heptawardWonDeals.deals.map(p => p.source.id);
  // console.log('h7M.length :', h7M.length);
  // console.log('DIFFF :', difference(h7M, salesforceM));
  // console.log('DIFFF2 :', difference(salesforceM, h7M));
  // console.log('openedDoublons :', openedDoublons.length);
  // console.log('wonDoublons :', wonDoublons.length);

  return {
    differences: {
      differenceOpened: differenceOpened.difference,
      differenceWon: differenceWon.difference,
      doublons: (openedDoublons.length + wonDoublons.length),
      unRegistered: (unRegisteredOpenedDeals.length + unRegisteredWonDeals.length),
    },
    salesforceOpened: {
      count: salesforceOpenedDeals.length,
    },
    salesforceWon: {
      count: salesforceWonDeals.length,
    },
    heptawardOpenedDeals,
    heptawardWonDeals,
    unRegisteredOpenedDeals,
    unRegisteredWonDeals,
    openedDoublons,
    wonDoublons,
    excessDeals: [...differenceOpened.excessDeals, ...differenceWon.excessDeals],
  };
};

const compareActivities = async (user, integrationChecked, allIntegrations, period) => {
  const since = srvDate.timestampStartPeriod(period);

  const salesforceMeetings = await salesforce.getEvents(integrationChecked.token, integrationChecked.instanceUrl, period, allIntegrations);
  const salesforceCalls = await salesforce.getTasks(integrationChecked.token, integrationChecked.instanceUrl, period, allIntegrations);

  const heptawardMeetings = await h7Echoes.getAddActivitiesInfos('meeting', user.team_id, since, 'salesforce');
  const heptawardCalls = await h7Echoes.getAddActivitiesInfos('call', user.team_id, since, 'salesforce');

  const meetingsDoublons = await H7Controls.doublonsOnEchoes(heptawardMeetings);
  const callsDoublons = await H7Controls.doublonsOnEchoes(heptawardCalls);

  await H7Controls.manageDoublonsActivities(meetingsDoublons, callsDoublons);

  const meetingsUnregistered = await PidControls.notRegistered(salesforceMeetings, heptawardMeetings);
  const callsUnregistered = await PidControls.notRegistered(salesforceCalls, heptawardCalls);

  return {
    differences: {
      // meetings: (heptawardMeetings.length - salesforceMeetings.length),
      meetingsDoublons: meetingsDoublons.length,
      meetingsUnregistered: meetingsUnregistered.length,
      // calls: (heptawardCalls.length - salesforceCalls.length),
      callsDoublons: callsDoublons.length,
      callsUnregistered: callsUnregistered.length,
    },
    salesforceMeetings: {
      ndActivities: salesforceMeetings.length,
      salesforceMeetings,
    },
    heptawardMeetings,
    meetingsDoublons,
    meetingsUnregistered,
    salesforceCalls: {
      ndActivities: salesforceCalls.length,
      salesforceCalls,
    },
    heptawardCalls,
    callsDoublons,
    callsUnregistered,
  };
};

exports.compareDeals = compareDeals;
exports.compareActivities = compareActivities;
