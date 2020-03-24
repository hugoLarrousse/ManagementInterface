const pipedrive = require('../services/pipedrive/pipedrive');
const h7Echoes = require('../services/heptaward/echoes');
const h7Users = require('../services/heptaward/user');
const Compare = require('../services/controls/pipedrive');
const H7Controls = require('../services/controls/heptaward/echoes');
const srvDate = require('../Utils/dates');
const genericControls = require('../services/controls/heptaward/generic');

const difference = require('lodash/difference');

const compareDeals = async (user, integrationChecked, allIntegrations, period) => {
  const { pipelines } = await h7Users.getSettingsForPipedrive(user.orga_id);
  const since = srvDate.timestampStartPeriod(period);

  const pipedriveOpenedDeals = await pipedrive.getDealsOpenedTimeline(
    integrationChecked.token, since,
    Boolean(integrationChecked.refreshToken), allIntegrations, pipelines
  );
  const pipedriveWonDeals = await pipedrive.getDealsWonTimeline(
    integrationChecked.token, since,
    Boolean(integrationChecked.refreshToken), allIntegrations, pipelines
  );

  const heptawardOpenedDeals = await h7Echoes.getDealsInfos('deal-opened', user.team_id, since, integrationChecked.integrationTeam, 'pipedrive');
  const heptawardWonDeals = await h7Echoes.getDealsInfos('deal-won', user.team_id, since, integrationChecked.integrationTeam, 'pipedrive');

  const unRegisteredOpenedDeals = Compare.notRegistered(pipedriveOpenedDeals, heptawardOpenedDeals.deals);
  const unRegisteredWonDeals = Compare.notRegistered(pipedriveWonDeals, heptawardWonDeals.deals);

  const openedDoublons = H7Controls.doublonsOnEchoes(heptawardOpenedDeals.deals);
  const wonDoublons = H7Controls.doublonsOnEchoes(heptawardWonDeals.deals);

  const differenceOpened = genericControls.tabDealsCompare(heptawardOpenedDeals.deals, pipedriveOpenedDeals);
  if (differenceOpened.excessDeals.length > 0) {
    await H7Controls.managePotentialDeletedDeals(differenceOpened.excessDeals, integrationChecked);
  }

  const differenceWon = genericControls.tabDealsCompare(heptawardWonDeals.deals, pipedriveWonDeals);

  if (openedDoublons.length > 0 || wonDoublons.length > 0) {
    await H7Controls.manageDoublonsDeals(openedDoublons, wonDoublons);
  }

  if (differenceWon.difference > 0) {
    await H7Controls.manageFalseWonDealsPipedrive(differenceWon.excessDeals, integrationChecked);
  }

  return {
    differences: {
      differenceOpened: differenceOpened.difference,
      differenceWon: differenceWon.difference,
      doublons: (openedDoublons.length + wonDoublons.length),
      unRegistered: (unRegisteredOpenedDeals.length + unRegisteredWonDeals.length),
    },
    // pipedriveOpened: {
    //   count: pipedriveOpenedDeals.totals.count,
    //   values: pipedriveOpenedDeals.totals.values,
    // },
    // pipedriveWon: {
    //   count: pipedriveWonDeals.totals.count,
    //   values: pipedriveWonDeals.totals.values,
    // },
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
  const {
    meetingTypes,
    callTypes,
    pipelines,
    activitiesNoDeal,
  } = await h7Users.getSettingsForPipedrive(user.orga_id);
  const since = srvDate.timestampStartPeriod(period);

  console.log('integrationChecked.token :', integrationChecked.token);

  const pipedriveMeetings = await pipedrive.getAddActivities(
    meetingTypes, integrationChecked.token,
    since, Boolean(integrationChecked.refreshToken), allIntegrations, pipelines, activitiesNoDeal
  );
  const pipedriveCalls = await pipedrive.getAddActivities(
    callTypes, integrationChecked.token,
    since, Boolean(integrationChecked.refreshToken), allIntegrations, pipelines, activitiesNoDeal,
  );
  console.log('pipedriveCalls.length :', pipedriveCalls.length);

  const heptawardMeetings = await h7Echoes.getAddActivitiesInfos('meeting', user.team_id, since, 'pipedrive');
  const heptawardCalls = await h7Echoes.getAddActivitiesInfos('call', user.team_id, since, 'pipedrive', pipelines, activitiesNoDeal);
  console.log('heptawardCalls.length :', heptawardCalls.length);

  const meetingsDoublons = await H7Controls.doublonsOnEchoes(heptawardMeetings);
  const callsDoublons = await H7Controls.doublonsOnEchoes(heptawardCalls);
  console.log('callsDoublons :', callsDoublons);
  const doublons = await H7Controls.doublonsOnEchoes([...heptawardCalls, ...heptawardMeetings]);

  const meetingsUnregistered = await Compare.notRegistered(pipedriveMeetings, heptawardMeetings);
  const callsUnregistered = await Compare.notRegistered(pipedriveCalls, heptawardCalls);

  const diffCall = difference(heptawardCalls.map(p => p.source.id), pipedriveCalls.map(p => p.id));
  console.log('diffCall :', diffCall);
  // const diffMeeting = difference(heptawardMeetings.map(p => p.source.id), pipedriveMeetings.map(p => p.id));

  await H7Controls.manageDoublonsActivities(meetingsDoublons, callsDoublons, doublons);

  return null;
  return {
    differences: {
      // meetings: (heptawardMeetings.length - pipedriveMeetings.length),
      meetingsDoublons: meetingsDoublons.length,
      meetingsUnregistered: meetingsUnregistered.length,
      // calls: (heptawardCalls.length - pipedriveCalls.length),
      callsDoublons: callsDoublons.length,
      callsUnregistered: callsUnregistered.length,
      doublons: doublons.length,
    },
    // pipedriveMeetings: {
    //   ndActivities: pipedriveMeetings.length,
    //   pipedriveMeetings,
    // },
    // heptawardMeetings,
    // meetingsDoublons,
    // meetingsUnregistered,
  //   pipedriveCalls: {
  //     ndActivities: pipedriveCalls.length,
  //     pipedriveCalls,
  //   },
  //   heptawardCalls,
  //   callsDoublons,
  //   callsUnregistered,
  };
};

exports.compareDeals = compareDeals;
exports.compareActivities = compareActivities;
