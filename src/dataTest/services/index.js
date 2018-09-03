const testPipedriveCtrl = require('../controllers/testPipedrive');
const testHubspotCtrl = require('../controllers/testHubspot');
const testSalesforceCtrl = require('../controllers/testSalesforce');
const logger = require('../Utils/loggerSlack');

exports.checkPipedriveByEmail = async (emails, forJames) => {
  if (forJames) {
    const resultActivities = await testPipedriveCtrl.compareActivities(emails[0], 'month');

    const resultDeals = await testPipedriveCtrl.compareDeals(emails[0], 'month');

    return { resultActivities, resultDeals };
  }
  for (const email of emails) {
    const resultActivities = await testPipedriveCtrl.compareActivities(email, 'month');
    const resultDeals = await testPipedriveCtrl.compareDeals(email, 'month');

    if (resultActivities) {
      if (Object.values(resultActivities.differences).filter(Number).length > 0) {
        logger.error('pipedrive', 'activities', email, 'month', resultActivities.differences);
      }
    }
    if (resultDeals) {
      if (Object.values(resultDeals.differences).filter(Number).length > 0) {
        logger.error('pipedrive', 'deals', email, 'month', resultDeals.differences);
      }
    }
  }
  return 1;
};


exports.checkHubspotByEmail = async (emails, forJames) => {
  if (forJames) {
    const resultActivities = await testHubspotCtrl.compareActivities(emails[0], 'month');
    const resultDeals = await testHubspotCtrl.compareDeals(emails[0], 'month');

    return { resultActivities, resultDeals };
  }
  for (const email of emails) {
    const resultActivities = await testHubspotCtrl.compareActivities(email, 'month');
    const resultDeals = await testHubspotCtrl.compareDeals(email, 'month');
    if (resultActivities) {
      if (Object.values(resultActivities.differences).filter(Number).length > 0) {
        logger.error('hubspot', 'activities', email, 'month', resultActivities.differences);
      }
    }
    if (resultDeals) {
      if (Object.values(resultDeals.differences).filter(Number).length > 0) {
        logger.error('hubspot', 'deals', email, 'month', resultDeals.differences);
      }
    }
  }
  return 1;
};


exports.checkSalesforceByEmail = async (emails, forJames) => {
  if (forJames) {
    const resultActivities = await testSalesforceCtrl.compareActivities(emails[0], 'month');
    const resultDeals = await testSalesforceCtrl.compareDeals(emails[0], 'month');

    return { resultActivities, resultDeals };
  }
  for (const email of emails) {
    const resultActivities = await testSalesforceCtrl.compareActivities(email, 'month');
    const resultDeals = await testSalesforceCtrl.compareDeals(email, 'month');
    if (resultActivities) {
      if (Object.values(resultActivities.differences).filter(Number).length > 0) {
        logger.error('salesforce', 'activities', email, 'month', resultActivities.differences);
      }
    }
    if (resultDeals) {
      if (Object.values(resultDeals.differences).filter(Number).length > 0) {
        logger.error('salesforce', 'deals', email, 'month', resultDeals.differences);
      }
    }
  }
  return 1;
};
