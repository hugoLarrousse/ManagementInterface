const { ObjectID } = require('mongodb');

const mongo = require('../../db/mongo');
const request = require('../Utils/request');
const salesforce = require('../services/salesforce');
const h7Echoes = require('../services/heptaward/echoes');
const h7Users = require('../services/heptaward/user');
const PidControls = require('../services/controls/pipedrive');
const H7Controls = require('../services/controls/heptaward/echoes');
const srvDate = require('../Utils/dates');
const genericControls = require('../services/controls/heptaward/generic');

const {
  salesforceUrlLogin,
  salesforceClientId,
  salesforceClientSecret,
} = process.env;


const isTokenValid = (expirationDate) => Date.now() - 300000 < Number(expirationDate);

const refreshToken = (token) => {
  const queryRefreshToken = `grant_type=refresh_token&refresh_token=${token}&client_secret=${salesforceClientSecret}&client_id=${salesforceClientId}`; // eslint-disable-line
  return request(salesforceUrlLogin, null, queryRefreshToken, 'POST', null, null, true);
};

const checkIntegration = async (integration) => {
  if (integration && isTokenValid(integration.tokenExpiresAt)) {
    return integration;
  }
  const result = await refreshToken(integration.refreshToken);
  if (result && result.access_token) {
    Object.assign(integration, { token: result.access_token, tokenExpiresAt: Date.now() + 7200000 });
    await mongo.updateOne(
      'heptaward',
      'integrations',
      { _id: ObjectID(integration._id) },
      { token: result.access_token, tokenExpiresAt: Date.now() + 7200000 }
    );
  }
  return integration;
};

const compareDeals = async (email, period) => {
  const user = await h7Users.getUser(email);

  const integration = await h7Users.getIntegration(user._id, 'Salesforce');
  if (!integration) {
    throw new Error('No integration');
  }
  const integrationChecked = await checkIntegration(integration);

  const allIntegrations = await h7Users.getIntegrationOrga(integrationChecked.orgaId, 'Salesforce');
  const since = srvDate.timestampStartPeriode(period);

  const salesforceOpenedDeals = await salesforce.getDealsOpened(integrationChecked.token, integrationChecked.instanceUrl, period, allIntegrations);

  const salesforceWonDeals = await salesforce.getDealsWon(integrationChecked.token, integrationChecked.instanceUrl, since, allIntegrations);

  const heptawardOpenedDeals = await h7Echoes.getDealsInfos('deal-opened', user.team_id, since, integrationChecked.integrationTeam);
  const heptawardWonDeals = await h7Echoes.getDealsInfos('deal-won', user.team_id, since, integrationChecked.integrationTeam);

  const unRegisteredOpenedDeals = PidControls.notRegistered(salesforceOpenedDeals, heptawardOpenedDeals.deals);
  const unRegisteredWonDeals = PidControls.notRegistered(salesforceWonDeals, heptawardWonDeals.deals);

  const openedDoublons = H7Controls.doublonsOnEchoes(heptawardOpenedDeals.deals);
  const wonDoublons = H7Controls.doublonsOnEchoes(heptawardWonDeals.deals);

  const differenceOpened = genericControls.tabDealsCompare(heptawardOpenedDeals.deals, salesforceOpenedDeals);
  const differenceWon = genericControls.tabDealsCompare(heptawardWonDeals.deals, salesforceWonDeals);

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

const compareActivities = async (email, period) => {
  const user = await h7Users.getUser(email);
  const integration = await h7Users.getIntegration(user._id, 'Salesforce');
  if (!integration) {
    throw new Error('No integration');
  }
  const integrationChecked = await checkIntegration(integration);

  const allIntegrations = await h7Users.getIntegrationOrga(integrationChecked.orgaId, 'Salesforce');
  const since = srvDate.timestampStartPeriode(period);

  const salesforceMeetings = await salesforce.getEvents(integrationChecked.token, integrationChecked.instanceUrl, period, allIntegrations);
  const salesforceCalls = await salesforce.getTasks(integrationChecked.token, integrationChecked.instanceUrl, period, allIntegrations);

  const heptawardMeetings = await h7Echoes.getAddActivitiesInfos('meeting', user.team_id, since);
  const heptawardCalls = await h7Echoes.getAddActivitiesInfos('call', user.team_id, since);

  const meetingsDoublons = await H7Controls.doublonsOnEchoes(heptawardMeetings.activities);
  const callsDoublons = await H7Controls.doublonsOnEchoes(heptawardCalls.activities);

  const meetingsUnregistered = await PidControls.notRegistered(salesforceMeetings, heptawardMeetings.activities);
  const callsUnregistered = await PidControls.notRegistered(salesforceCalls, heptawardCalls.activities);

  return {
    differences: {
      meetings: (heptawardMeetings.ndActivities - salesforceMeetings.length),
      meetingsDoublons: meetingsDoublons.length,
      meetingsUnregistered: meetingsUnregistered.length,
      calls: (heptawardCalls.ndActivities - salesforceCalls.length),
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
