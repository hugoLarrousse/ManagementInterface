const cron = require('node-cron');
const logger = require('../Utils/loggerSlack');
const moment = require('moment');

const checkData = require('../services');
const config = require('config');

const emails = config.get('emails');

exports.cron = async () => {
  cron.schedule('0 2 * * *', async () => {
    try {
      logger.info(`START TEST AUTOMATION 3H: ${moment().format('LLL')}`);
      await checkData.checkPipedriveByEmail(emails.pipedrive, false, 'month');
      logger.info('Pipedrive month done');
      await checkData.checkHubspotByEmail(emails.hubspot, false, 'week');
      logger.info('Hubspot week done');
      await checkData.checkSalesforceByEmail(emails.salesforce, false, 'month');
      logger.info('Salesforce month done');
      await checkData.checkHubspotByEmail(emails.hubspot, false, 'day');
      logger.info('Hubspot day done');
      setTimeout(() => {
        logger.info(`END TEST AUTOMATION : ${moment().format('LLL')}`);
      }, 3000);
    } catch (e) {
      setTimeout(() => {
        logger.info(`END TEST AUTOMATION WITH ERRORS:
          ${e.message}
        ${moment().format('LLL')}`);
      }, 3000);
    }
  });
  cron.schedule('0 12 * * *', async () => {
    try {
      logger.info(`START TEST AUTOMATION 13H: ${moment().format('LLL')}`);
      await checkData.checkPipedriveByEmail(emails.pipedrive, false, 'month');
      logger.info('Pipedrive month done');
      await checkData.checkHubspotByEmail(emails.hubspot, false, 'week');
      logger.info('Hubspot week done');
      await checkData.checkSalesforceByEmail(emails.salesforce, false, 'month');
      logger.info('Salesforce month done');
      await checkData.checkHubspotByEmail(emails.hubspot, false, 'day');
      logger.info('Hubspot day done');
      setTimeout(() => {
        logger.info(`END TEST AUTOMATION : ${moment().format('LLL')}`);
      }, 3000);
    } catch (e) {
      setTimeout(() => {
        logger.info(`END TEST AUTOMATION WITH ERRORS:
          ${e.message}
        ${moment().format('LLL')}`);
      }, 3000);
    }
  });
  cron.schedule('0 21 * * *', async () => {
    try {
      logger.info(`START TEST AUTOMATION 22H: ${moment().format('LLL')}`);
      await checkData.checkPipedriveByEmail(emails.pipedrive, false, 'month');
      logger.info('Pipedrive month done');
      await checkData.checkHubspotByEmail(emails.hubspot, false, 'week');
      logger.info('Hubspot week done');
      await checkData.checkSalesforceByEmail(emails.salesforce, false, 'month');
      logger.info('Salesforce month done');
      await checkData.checkHubspotByEmail(emails.hubspot, false, 'day');
      logger.info('Hubspot day done');
      setTimeout(() => {
        logger.info(`END TEST AUTOMATION : ${moment().format('LLL')}`);
      }, 3000);
    } catch (e) {
      setTimeout(() => {
        logger.info(`END TEST AUTOMATION WITH ERRORS:
          ${e.message}
        ${moment().format('LLL')}`);
      }, 3000);
    }
  });
};
