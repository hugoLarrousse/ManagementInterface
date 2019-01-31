const testPipedriveCtrl = require('../controllers/testPipedrive');
const testHubspotCtrl = require('../controllers/testHubspot');
const testSalesforceCtrl = require('../controllers/testSalesforce');
const logger = require('../Utils/loggerSlack');
const syncDataAuto = require('./heptaward/sync');
const hubspotUtils = require('../Utils/hubspot');
const h7Users = require('../services/heptaward/user');
const pipedriveRefreshToken = require('./pipedrive/refreshToken');
const salesforceCheckToken = require('./salesforce/checkIntegration');

const isTokenValid = (expirationDate) => Date.now() - 300000 < Number(expirationDate);

exports.checkPipedriveByEmail = async (emails, forJames, period, toBeSync) => {
  if (forJames) {
    const resultActivities = await testPipedriveCtrl.compareActivities(emails[0], period || 'month');

    const resultDeals = await testPipedriveCtrl.compareDeals(emails[0], period || 'month');

    return { resultActivities, resultDeals };
  }
  for (const email of emails) {
    try {
      console.log('email :', email);

      const user = await h7Users.getUser(email);

      const integration = await h7Users.getIntegration(user._id, 'Pipedrive');
      let integrationChecked = integration;

      if (integration.refreshToken) {
        integrationChecked = await pipedriveRefreshToken(integration);
      }

      const allIntegrations = await h7Users.getIntegrationOrga(integrationChecked.orgaId, 'Pipedrive');

      const resultActivities = await testPipedriveCtrl.compareActivities(user, integrationChecked, allIntegrations, period || 'month');
      const resultDeals = await testPipedriveCtrl.compareDeals(user, integrationChecked, allIntegrations, period || 'month');

      if (resultActivities) {
        if (Object.values(resultActivities.differences).filter(Number).length > 0) {
          logger.error('pipedrive', 'activities', email, period || 'month', resultActivities.differences);
        }
      }
      if (resultDeals) {
        if (Object.values(resultDeals.differences).filter(Number).length > 0) {
          logger.error('pipedrive', 'deals', email, period || 'month', resultDeals.differences);
        }
      }
      if (toBeSync) {
        if ((resultDeals && resultDeals.differences.unRegistered > 0)
          || (resultActivities && (resultActivities.differences.meetingsUnregistered || resultActivities.differences.callsUnregistered))) {
          syncDataAuto(user._id, 'pipedrive', email);
        }
      }
    } catch (e) {
      console.log(`Error user: ${email}`, e.message);
    }
  }
  return 1;
};


exports.checkHubspotByEmail = async (emails, forJames, period, toBeSync) => {
  if (forJames) {
    const resultActivities = await testHubspotCtrl.compareActivities(emails[0], period || 'month');
    const resultDeals = await testHubspotCtrl.compareDeals(emails[0], period || 'month');

    return { resultActivities, resultDeals };
  }
  for (const email of emails) {
    try {
      console.log('email :', email);
      const user = await h7Users.getUser(email);
      const integration = await h7Users.getIntegration(user._id, 'Hubspot');

      let integrationChecked = integration;
      if (integration.refreshToken && !isTokenValid(integration.tokenExpiresAt)) {
        integrationChecked = await hubspotUtils.refreshToken(integration);
      }

      const allIntegrations = await h7Users.getIntegrationOrga(integrationChecked.orgaId, 'Hubspot');

      const resultActivities = await testHubspotCtrl.compareActivities(user, integrationChecked, allIntegrations, period || 'month');
      const resultDeals = await testHubspotCtrl.compareDeals(user, integrationChecked, allIntegrations, period || 'month');

      if (resultActivities) {
        if (Object.values(resultActivities.differences).filter(Number).length > 0) {
          logger.error('hubspot', 'activities', email, period || 'month', resultActivities.differences);
        }
      }
      if (resultDeals) {
        if (Object.values(resultDeals.differences).filter(Number).length > 0) {
          logger.error('hubspot', 'deals', email, period || 'month', resultDeals.differences);
        }
      }

      if (toBeSync) {
        if ((resultDeals && resultDeals.differences.unRegistered > 0)
          || (resultActivities && (resultActivities.differences.meetingsUnregistered || resultActivities.differences.callsUnregistered))) {
          syncDataAuto(user._id, 'hubspot', email);
        }
      }
    } catch (e) {
      console.log(`Error user: ${email}`, e.message);
    }
  }
  return 1;
};


exports.checkSalesforceByEmail = async (emails, forJames, period, toBeSync) => {
  if (forJames) {
    const resultActivities = await testSalesforceCtrl.compareActivities(emails[0], period || 'month');
    const resultDeals = await testSalesforceCtrl.compareDeals(emails[0], period || 'month');

    return { resultActivities, resultDeals };
  }
  for (const email of emails) {
    console.log('email :', email);

    const user = await h7Users.getUser(email);
    const integration = await h7Users.getIntegration(user._id, 'Salesforce');
    if (!integration) {
      throw new Error('No integration');
    }
    const integrationChecked = await salesforceCheckToken(integration);

    const allIntegrations = await h7Users.getIntegrationOrga(integrationChecked.orgaId, 'Salesforce');

    const resultActivities = await testSalesforceCtrl.compareActivities(user, integrationChecked, allIntegrations, period || 'month');
    const resultDeals = await testSalesforceCtrl.compareDeals(user, integrationChecked, allIntegrations, period || 'month');

    if (resultActivities) {
      if (Object.values(resultActivities.differences).filter(Number).length > 0) {
        logger.error('salesforce', 'activities', email, period || 'month', resultActivities.differences);
      }
    }
    if (resultDeals) {
      if (Object.values(resultDeals.differences).filter(Number).length > 0) {
        logger.error('salesforce', 'deals', email, period || 'month', resultDeals.differences);
      }
    }
    if (toBeSync) {
      // if ((resultDeals && resultDeals.differences.unRegistered > 0)
      //   || (resultActivities && (resultActivities.differences.meetingsUnregistered || resultActivities.differences.callsUnregistered))) {
      //   syncDataAuto(user._id, 'salesforce', email);
      // }
    }
  }
  return 1;
};
