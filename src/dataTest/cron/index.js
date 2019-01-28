const cron = require('node-cron');
const logger = require('../Utils/loggerSlack');
const moment = require('moment');

const checkData = require('../services');
const config = require('config');

const emails = config.get('emails');

const timeoutPromise = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

exports.cron = async () => {
  if (process.env.NODE_ENV === 'production') {
    cron.schedule('0 12 * * *', async () => {
      try {
        logger.info(`START TEST AUTOMATION 13H: ${moment().format('LLL')}`);
        logger.info('PIPEDRIVE MONTH');
        await checkData.checkPipedriveByEmail(emails.pipedrive, false, 'month');
        await timeoutPromise(300);
        logger.info('--------------------');
        logger.info('HUBSPOT WEEK');
        await checkData.checkHubspotByEmail(emails.hubspot, false, 'week');
        await timeoutPromise(300);
        logger.info('--------------------');
        logger.info('SALESFORCE MONTH');
        await checkData.checkSalesforceByEmail(emails.salesforce, false, 'month');
        await timeoutPromise(300);
        logger.info('--------------------');
        logger.info('HUBSPOT DAY');
        await checkData.checkHubspotByEmail(emails.hubspot, false, 'day');
        await timeoutPromise(1000);
        logger.info(`END TEST AUTOMATION : ${moment().format('LLL')}`);
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
        logger.info('PIPEDRIVE MONTH');
        await checkData.checkPipedriveByEmail(emails.pipedrive, false, 'month', true);
        await timeoutPromise(300);
        logger.info('--------------------');
        logger.info('HUBSPOT WEEK');
        await checkData.checkHubspotByEmail(emails.hubspot, false, 'week', true);
        await timeoutPromise(300);
        logger.info('--------------------');
        logger.info('SALESFORCE MONTH');
        await checkData.checkSalesforceByEmail(emails.salesforce, false, 'month', true);
        await timeoutPromise(300);
        logger.info('--------------------');
        logger.info('HUBSPOT DAY');
        await checkData.checkHubspotByEmail(emails.hubspot, false, 'day', true);
        await timeoutPromise(1000);
        logger.info(`END TEST AUTOMATION : ${moment().format('LLL')}`);
      } catch (e) {
        setTimeout(() => {
          logger.info(`END TEST AUTOMATION WITH ERRORS:
            ${e.message}
          ${moment().format('LLL')}`);
        }, 3000);
      }
    });
  } else {
    try {
      logger.info('START TEST AUTOMATION MANUAL');
      await timeoutPromise(300);
      logger.info('PIPEDRIVE MONTH');
      await checkData.checkPipedriveByEmail(emails.pipedrive, false, 'month');
      await timeoutPromise(300);
      logger.info('--------------------');
      logger.info('HUBSPOT WEEK');
      await checkData.checkHubspotByEmail(emails.hubspot, false, 'week');
      await timeoutPromise(300);
      logger.info('--------------------');
      logger.info('SALESFORCE MONTH');
      await checkData.checkSalesforceByEmail(emails.salesforce, false, 'month');
      await timeoutPromise(300);
      logger.info('--------------------');
      logger.info('HUBSPOT DAY');
      await checkData.checkHubspotByEmail(emails.hubspot, false, 'day');
      await timeoutPromise(1000);
      logger.info('END TEST AUTOMATION MANUAL');
    } catch (e) {
      setTimeout(() => {
        logger.info(`END TEST AUTOMATION WITH ERRORS:
          ${e.message}
        ${moment().format('LLL')}`);
      }, 3000);
    }
  }
};
