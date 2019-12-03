const cron = require('node-cron');
const logger = require('../Utils/loggerSlack');
const moment = require('moment');

const checkData = require('../services');
const urlMetrics = require('../services/urlMetrics');
const uptime = require('../services/uptime');

const { emailsPipedrive, emailsHubspot, emailsSalesforce } = process.env;
const emailsPipedriveFormatted = emailsPipedrive.split(', ');
const emailsHubspotFormatted = emailsHubspot.split(', ');
const emailsSalesforceFormatted = emailsSalesforce.split(', ');


const timeoutPromise = require('../Utils/timeout');


exports.cronRequestMetrics = async () => {
  cron.schedule('0 20 * * *', async () => {
    try {
      logger.info(`START REQUEST METRICS 21h: ${moment().format('DD/MM/YYYY')}`);
      await urlMetrics.pathCount();
      await timeoutPromise(1000);
      await urlMetrics.statusCode();
      await timeoutPromise(1000);
      await urlMetrics.originUrl();
      logger.info(`END REQUEST METRICS ${moment().format('DD/MM/YYYY')}`);
    } catch (e) {
      setTimeout(() => {
        logger.info(`END REQUEST METRICS WITH ERRORS:
          ${e.message}
        ${moment().format('LLL')}`);
      }, 3000);
    }
  });
};

exports.cronRequestUptime = async () => {
  cron.schedule('5 20 * * *', async () => {
    try {
      logger.info(`START CHECK UPTIME 21h05: ${moment().format('DD/MM/YYYY')}`);
      await timeoutPromise(1000);
      logger.info('api.heptaward.com');
      await uptime.statusCode();
      await timeoutPromise(1000);
      await uptime.elapseTime();
      logger.info(`END CHECK UPTIME ${moment().format('DD/MM/YYYY')}`);
    } catch (e) {
      setTimeout(() => {
        logger.info(`END REQUEST METRICS WITH ERRORS:
          ${e.message}
        ${moment().format('LLL')}`);
      }, 3000);
    }
  });
};

exports.cron = async () => {
  if (process.env.NODE_ENV === 'production') {
    // cron.schedule('0 11 * * *', async () => {
    //   try {
    //     logger.info(`START TEST AUTOMATION 13H: ${moment().format('LLL')}`);
    //     logger.info('PIPEDRIVE MONTH');
    //     await checkData.checkPipedriveByEmail(emails.pipedrive, false, 'month');
    //     await timeoutPromise(1000);
    //     logger.info('--------------------');
    //     logger.info('HUBSPOT WEEK');
    //     await checkData.checkHubspotByEmail(emails.hubspot, false, 'week');
    //     await timeoutPromise(1000);
    //     logger.info('--------------------');
    //     logger.info('SALESFORCE MONTH');
    //     await checkData.checkSalesforceByEmail(emails.salesforce, false, 'month');
    //     await timeoutPromise(1000);
    //     logger.info('--------------------');
    //     logger.info('HUBSPOT DAY');
    //     await checkData.checkHubspotByEmail(emails.hubspot, false, 'day');
    //     await timeoutPromise(1000);
    //     logger.info(`END TEST AUTOMATION : ${moment().format('LLL')}`);
    //   } catch (e) {
    //     setTimeout(() => {
    //       logger.info(`END TEST AUTOMATION WITH ERRORS:
    //         ${e.message}
    //       ${moment().format('LLL')}`);
    //     }, 3000);
    //   }
    // });
    cron.schedule('0 21 * * *', async () => {
      try {
        logger.info(`START TEST AUTOMATION: ${moment().format('LLL')}`);
        logger.info(`PIPEDRIVE MONTH, ${emailsPipedriveFormatted.length} accounts`);
        await checkData.checkPipedriveByEmail(emailsPipedriveFormatted, false, 'month', true);
        await timeoutPromise(1000);
        logger.info('--------------------');
        logger.info(`HUBSPOT WEEK, ${emailsHubspotFormatted.length} accounts`);
        await checkData.checkHubspotByEmail(emailsHubspotFormatted, false, 'week', true);
        await timeoutPromise(1000);
        logger.info('--------------------');
        logger.info(`SALESFORCE MONTH ${emailsSalesforceFormatted.length} accounts`);
        await checkData.checkSalesforceByEmail(emailsSalesforceFormatted, false, 'month', true);
        await timeoutPromise(1000);
        logger.info('--------------------');
        logger.info(`HUBSPOT DAY, ${emailsHubspotFormatted.length} accounts`);
        await checkData.checkHubspotByEmail(emailsHubspotFormatted, false, 'day');
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
      // logger.info(`PIPEDRIVE MONTH, ${emailsPipedriveFormatted.length} accounts`);
      // await checkData.checkPipedriveByEmail(emailsPipedriveFormatted, false, 'month');
      // await timeoutPromise(1000);
      // logger.info('--------------------');
      // logger.info(`HUBSPOT WEEK, ${emailsHubspotFormatted.length} accounts`);
      // await checkData.checkHubspotByEmail(emailsHubspotFormatted, false, 'week');
      // await timeoutPromise(1000);
      logger.info('--------------------');
      logger.info(`SALESFORCE MONTH ${emailsSalesforceFormatted.length} accounts`);
      await checkData.checkSalesforceByEmail(emailsSalesforceFormatted, false, 'month');
      await timeoutPromise(1000);
      logger.info('--------------------');
      // logger.info(`HUBSPOT DAY, ${emailsHubspotFormatted.length} accounts`);
      // await checkData.checkHubspotByEmail(emailsHubspotFormatted, false, 'day');
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
