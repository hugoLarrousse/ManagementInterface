const pipedrive = require('../services/pipedrive/pipedrive');
const h7Echoes = require('../services/heptaward/echoes');
const h7Users = require('../services/heptaward/user');
const PidControls = require('../services/controls/pipedrive');
const H7Controls = require('../services/controls/heptaward/echoes');
const srvDate = require('../Utils/dates');
const genericControls = require('../services/controls/heptaward/generic');

// const difference = require('lodash/difference');

const compareDeals = async (user, integrationChecked, allIntegrations, period) => {
  const since = srvDate.timestampStartPeriod(period);

  const pipedriveOpenedDeals = await pipedrive.getDealsOpenedTimeline(
    integrationChecked.token, since,
    Boolean(integrationChecked.refreshToken), allIntegrations
  );
  const pipedriveWonDeals = await pipedrive.getDealsWonTimeline(
    integrationChecked.token, since,
    Boolean(integrationChecked.refreshToken), allIntegrations
  );

  const heptawardOpenedDeals = await h7Echoes.getDealsInfos('deal-opened', user.team_id, since, integrationChecked.integrationTeam);
  const heptawardWonDeals = await h7Echoes.getDealsInfos('deal-won', user.team_id, since, integrationChecked.integrationTeam);

  /* test */
  // const pipedriveM = pipedriveOpenedDeals.map(p => p.id);
  // console.log('pipedriveM :', pipedriveM.length);
  // const h7M = heptawardOpenedDeals.deals.map(p => p.source.id);
  // console.log('h7M :', h7M.length);
  // console.log('difference1 :', difference(h7M, pipedriveM));
  // console.log('difference2 :', difference(pipedriveM, h7M));

  const unRegisteredOpenedDeals = PidControls.notRegistered(pipedriveOpenedDeals, heptawardOpenedDeals.deals);
  const unRegisteredWonDeals = PidControls.notRegistered(pipedriveWonDeals, heptawardWonDeals.deals);

  const openedDoublons = H7Controls.doublonsOnEchoes(heptawardOpenedDeals.deals);
  // console.log('openedDoublons :', openedDoublons);
  const wonDoublons = H7Controls.doublonsOnEchoes(heptawardWonDeals.deals);
  // console.log('wonDoublons :', wonDoublons);
  const differenceOpened = genericControls.tabDealsCompare(heptawardOpenedDeals.deals, pipedriveOpenedDeals);
  const differenceWon = genericControls.tabDealsCompare(heptawardWonDeals.deals, pipedriveWonDeals);

  if (openedDoublons.length > 0 || wonDoublons.length > 0) {
    await H7Controls.manageDoublonsDeals(openedDoublons, wonDoublons);
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
  const { meetingTypes, callTypes } = await h7Users.getSettings(user.orga_id);
  const since = srvDate.timestampStartPeriod(period);

  const pipedriveMeetings = await pipedrive.getAddActivities(
    meetingTypes, integrationChecked.token,
    since, Boolean(integrationChecked.refreshToken), allIntegrations
  );

  const pipedriveCalls = await pipedrive.getAddActivities(
    callTypes, integrationChecked.token,
    since, Boolean(integrationChecked.refreshToken), allIntegrations
  );

  const heptawardMeetings = await h7Echoes.getAddActivitiesInfos('meeting', user.team_id, since);
  const heptawardCalls = await h7Echoes.getAddActivitiesInfos('call', user.team_id, since);

  /* test */
  const meetingsDoublons = await H7Controls.doublonsOnEchoes(heptawardMeetings);
  const callsDoublons = await H7Controls.doublonsOnEchoes(heptawardCalls);
  const doublons = await H7Controls.doublonsOnEchoes([...heptawardCalls, ...heptawardMeetings]);

  const meetingsUnregistered = await PidControls.notRegistered(pipedriveMeetings, heptawardMeetings);

  const callsUnregistered = await PidControls.notRegistered(pipedriveCalls, heptawardCalls);
  // console.log('callsUnregistered :', callsUnregistered);
  // const diffCall = difference(heptawardCalls.map(p => p.source.id), pipedriveCalls.map(p => p.id));
  // const diffMeeting = difference(heptawardMeetings.map(p => p.source.id), pipedriveMeetings.map(p => p.id));

  await H7Controls.manageDoublonsActivities(meetingsDoublons, callsDoublons, doublons);

  // console.log('doublons :', doublons);
  // console.log('diffCall :', diffCall);
  // console.log('diffMeeting :', diffMeeting);

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
    pipedriveMeetings: {
      ndActivities: pipedriveMeetings.length,
      pipedriveMeetings,
    },
    heptawardMeetings,
    meetingsDoublons,
    meetingsUnregistered,
    pipedriveCalls: {
      ndActivities: pipedriveCalls.length,
      pipedriveCalls,
    },
    heptawardCalls,
    callsDoublons,
    callsUnregistered,
  };
};

exports.compareDeals = compareDeals;
exports.compareActivities = compareActivities;
