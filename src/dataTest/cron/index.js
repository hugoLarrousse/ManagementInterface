const cron = require('node-cron');
const logger = require('../Utils/loggerSlack');
const moment = require('moment');

const checkData = require('../services');
const config = require('config');
const urlCount = require('../services/urlCount');

const emails = config.get('emails');

const timeoutPromise = require('../Utils/timeout');


exports.cronUrlCount = async () => {
  cron.schedule('0 20 * * *', async () => {
    try {
      logger.info(`START URL COUNT 22h: ${moment().format('DD/MM/YYYY')}`);
      await urlCount();
      await timeoutPromise(1000);
      logger.info(`END URL COUNT ${moment().format('DD/MM/YYYY')}`);
    } catch (e) {
      setTimeout(() => {
        logger.info(`END METRIC COUNT WITH ERRORS:
          ${e.message}
        ${moment().format('LLL')}`);
      }, 3000);
    }
  });
};

exports.cron = async () => {
  if (process.env.NODE_ENV === 'production') {
    cron.schedule('0 11 * * *', async () => {
      try {
        logger.info(`START TEST AUTOMATION 13H: ${moment().format('LLL')}`);
        logger.info('PIPEDRIVE MONTH');
        await checkData.checkPipedriveByEmail(emails.pipedrive, false, 'month');
        await timeoutPromise(1000);
        logger.info('--------------------');
        logger.info('HUBSPOT WEEK');
        await checkData.checkHubspotByEmail(emails.hubspot, false, 'week');
        await timeoutPromise(1000);
        logger.info('--------------------');
        logger.info('SALESFORCE MONTH');
        await checkData.checkSalesforceByEmail(emails.salesforce, false, 'month');
        await timeoutPromise(1000);
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
        logger.info(`START TEST AUTOMATION 23H: ${moment().format('LLL')}`);
        logger.info('PIPEDRIVE MONTH');
        await checkData.checkPipedriveByEmail(emails.pipedrive, false, 'month', true);
        await timeoutPromise(1000);
        logger.info('--------------------');
        logger.info('HUBSPOT WEEK');
        await checkData.checkHubspotByEmail(emails.hubspot, false, 'week', true);
        await timeoutPromise(1000);
        logger.info('--------------------');
        logger.info('SALESFORCE MONTH');
        await checkData.checkSalesforceByEmail(emails.salesforce, false, 'month', true);
        await timeoutPromise(1000);
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
  } else {
    try {
      logger.info('START TEST AUTOMATION MANUAL');
      await timeoutPromise(1000);
      logger.info('PIPEDRIVE MONTH');
      await checkData.checkPipedriveByEmail(emails.pipedrive, false, 'month');
      await timeoutPromise(1000);
      logger.info('--------------------');
      logger.info('HUBSPOT WEEK');
      await checkData.checkHubspotByEmail(emails.hubspot, false, 'week');
      await timeoutPromise(1000);
      logger.info('--------------------');
      logger.info('SALESFORCE MONTH');
      await checkData.checkSalesforceByEmail(emails.salesforce, false, 'month');
      await timeoutPromise(1000);
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
