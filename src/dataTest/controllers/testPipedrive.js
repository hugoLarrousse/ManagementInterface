const { ObjectID } = require('mongodb');

const pipedrive = require('../services/pipedrive/pipedrive');
const h7Echoes = require('../services/heptaward/echoes');
const h7Users = require('../services/heptaward/user');
const PidControls = require('../services/controls/pipedrive');
const H7Controls = require('../services/controls/heptaward/echoes');
const srvDate = require('../Utils/dates');
const genericControls = require('../services/controls/heptaward/generic');
const request = require('../Utils/request');
const mongo = require('../../db/mongo');
// const difference = require('lodash/difference');

const pipedriveLoginUrl = 'https://oauth.pipedrive.com';

const refreshToken = async (integrationInfo) => {
  if (!integrationInfo || !integrationInfo.token) {
    throw new Error('no integrationInfo !!');
  }
  if (!integrationInfo.tokenExpiresAt) {
    throw new Error('no integrationInfo.tokenExpiresAt ');
  }

  if (integrationInfo.tokenExpiresAt < Date.now() + 360000) {
    const data = {
      grant_type: 'refresh_token',
      refresh_token: integrationInfo.refreshToken,
      client_id: process.env.pipedriveClientId,
      client_secret: process.env.pipedriveClientSecret,
    };
    const refreshedTokenInfo = await request(
      pipedriveLoginUrl, 'oauth/token', null, 'POST',
      { 'Content-Type': 'application/x-www-form-urlencoded' }, data, null, true
    );

    if (refreshedTokenInfo && refreshedTokenInfo.access_token) {
      const toUpdate = {
        token: refreshedTokenInfo.access_token,
        refreshToken: refreshedTokenInfo.refresh_token,
        tokenExpiresAt: Date.now() + (refreshedTokenInfo.expires_in * 1000),
      };
      const updatedIntegration = await mongo.updateOne('heptaward', 'integrations', { _id: ObjectID(integrationInfo._id) }, toUpdate);
      if (!updatedIntegration) {
        throw new Error(`fail updatedIntegration _id integration : ${integrationInfo._id}`);
      }
      return updatedIntegration;
    }
    throw new Error('fail refresh token');
  }
  return integrationInfo;
};

const compareDeals = async (email, period) => {
  const user = await h7Users.getUser(email);

  const integration = await h7Users.getIntegration(user._id, 'Pipedrive');

  let integrationChecked = integration;
  if (integration.refreshToken) {
    integrationChecked = await refreshToken(integration);
  }

  const allIntegrations = await h7Users.getIntegrationOrga(integrationChecked.orgaId, 'Pipedrive');
  const since = srvDate.timestampStartPeriod(period);

  const pipedriveOpenedDeals = await pipedrive.getDealsOpenedTimeline(
    integrationChecked.token, since,
    Boolean(integration.refreshToken), allIntegrations
  );
  const pipedriveWonDeals = await pipedrive.getDealsWonTimeline(integrationChecked.token, since, Boolean(integration.refreshToken), allIntegrations);

  const heptawardOpenedDeals = await h7Echoes.getDealsInfos('deal-opened', user.team_id, since, integrationChecked.integrationTeam);
  const heptawardWonDeals = await h7Echoes.getDealsInfos('deal-won', user.team_id, since, integrationChecked.integrationTeam);

  /* test */
  // const pipedriveM = pipedriveWonDeals.map(p => p.id);
  // console.log('pipedriveM :', pipedriveM.length);
  // const h7M = heptawardWonDeals.deals.map(p => p.source.id);
  // console.log('h7M :', h7M.length);
  // console.log('difference :', difference(h7M, pipedriveM));

  const unRegisteredOpenedDeals = PidControls.notRegistered(pipedriveOpenedDeals, heptawardOpenedDeals.deals);
  const unRegisteredWonDeals = PidControls.notRegistered(pipedriveWonDeals, heptawardWonDeals.deals);

  const openedDoublons = H7Controls.doublonsOnEchoes(heptawardOpenedDeals.deals);
  const wonDoublons = H7Controls.doublonsOnEchoes(heptawardWonDeals.deals);

  const differenceOpened = genericControls.tabDealsCompare(heptawardOpenedDeals.deals, pipedriveOpenedDeals);
  const differenceWon = genericControls.tabDealsCompare(heptawardWonDeals.deals, pipedriveWonDeals);

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

const compareActivities = async (email, period) => {
  const user = await h7Users.getUser(email);

  const integration = await h7Users.getIntegration(user._id, 'Pipedrive');
  let integrationChecked = integration;

  if (integration.refreshToken) {
    integrationChecked = await refreshToken(integration);
  }

  const { meetingTypes, callTypes } = await h7Users.getSettings(user.orga_id);

  const allIntegrations = await h7Users.getIntegrationOrga(integrationChecked.orgaId, 'Pipedrive');
  const since = srvDate.timestampStartPeriod(period);

  const pipedriveMeetings = await pipedrive.getAddActivities(
    meetingTypes, integrationChecked.token,
    since, Boolean(integration.refreshToken), allIntegrations
  );

  const pipedriveCalls = await pipedrive.getAddActivities(
    callTypes, integrationChecked.token,
    since, Boolean(integration.refreshToken), allIntegrations
  );

  const heptawardMeetings = await h7Echoes.getAddActivitiesInfos('meeting', user.team_id, since);
  const heptawardCalls = await h7Echoes.getAddActivitiesInfos('call', user.team_id, since);

  /* test */
  // const pipedriveM = pipedriveCalls.map(p => p.id);
  // const h7M = heptawardCalls.map(p => p.source.id);
  // console.log('difference :', difference(h7M, pipedriveM));

  const meetingsDoublons = await H7Controls.doublonsOnEchoes(heptawardMeetings);
  const callsDoublons = await H7Controls.doublonsOnEchoes(heptawardCalls);
  const doublons = await H7Controls.doublonsOnEchoes([...heptawardCalls, ...heptawardMeetings]);

  const meetingsUnregistered = await PidControls.notRegistered(pipedriveMeetings, heptawardMeetings);
  const callsUnregistered = await PidControls.notRegistered(pipedriveCalls, heptawardCalls);

  return {
    differences: {
      meetings: (heptawardMeetings.length - pipedriveMeetings.length),
      meetingsDoublons: meetingsDoublons.length,
      meetingsUnregistered: meetingsUnregistered.length,
      calls: (heptawardCalls.length - pipedriveCalls.length),
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
