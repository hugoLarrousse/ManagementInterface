const cron = require('node-cron');
const testPipedriveCtrl = require('../controllers/testPipedrive');
const testHubspotCtrl = require('../controllers/testHubspot');
const testSalesforceCtrl = require('../controllers/testSalesforce');
const logger = require('../Utils/loggerSlack');
const moment = require('moment');

const pipedriveEmails = ['axel.manoukian@moovone.fr'];
const hubspotEmails = ['thomas@paygreen.fr', 'tony@insurge.digital', 'hello@ecommerce-nation.fr'];
const salesforceEmails = ['samy@heptaward.com'];


const cronTask = async () => {
  try {
    logger.info(`START TEST AUTOMATION : ${moment().format('LLL')}`);
    setTimeout(async () => {
      for (const email of pipedriveEmails) {
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
      for (const email of hubspotEmails) {
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
      for (const email of salesforceEmails) {
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
      setTimeout(() => {
        logger.info(`END TEST AUTOMATION : ${moment().format('LLL')}`);
      }, 3000);
    }, 1000);
  } catch (e) {
    console.log('ERROR :', e.message);
    logger.info(`END TEST AUTOMATION WITH ERRORS: ${moment().format('LLL')}`);
  }
};

exports.cron = () => {
  cron.schedule('0 3 * * *', async () => {
    await cronTask();
  });
};

exports.cronTask = cronTask;
