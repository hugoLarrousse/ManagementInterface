const cron = require('node-cron');
const moment = require('moment');
const config = require('config');

const request = require('../../dataTest/Utils/request');
const checkData = require('../services');
const metrics = require('../services/metrics');
const uptime = require('../services/uptime');
const timeoutPromise = require('../Utils/timeout');
const Pis = require('../services/pis');
const logger = require('../Utils/loggerSlack');


const { fixedToken } = process.env;

exports.cronRequestMetrics = async () => {
  cron.schedule('0 20 * * *', async () => {
    try {
      logger.info(`START REQUEST METRICS 21h: ${moment().format('DD/MM/YYYY')}`);
      await metrics.pathCount();
      await timeoutPromise(1000);
      await metrics.statusCode();
      await timeoutPromise(1000);
      await metrics.originUrl();
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
      await timeoutPromise(1000);
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

exports.cronRequestLocationPath = async () => {
  cron.schedule('29 15 * * 5', async () => {
    try {
      logger.info(`START PAGE VISITED 16h29: ${moment().format('DD/MM/YYYY')}`);
      await metrics.locationPathCount();
      logger.info(`END ${moment().format('DD/MM/YYYY')}`);
    } catch (e) {
      setTimeout(() => {
        logger.info(`END PAGE VISITED WITH ERRORS:
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
    //     await checkData.checkPipedriveByEmail(false, 'month');
    //     await timeoutPromise(1000);
    //     logger.info('--------------------');
    //     logger.info('HUBSPOT WEEK');
    //     await checkData.checkHubspotByEmail(false, 'week');
    //     await timeoutPromise(1000);
    //     logger.info('--------------------');
    //     logger.info('SALESFORCE MONTH');
    //     await checkData.checkSalesforceByEmail(false, 'month');
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
        await checkData.checkPipedriveByEmail(false, 'month', true);
        await timeoutPromise(1000);
        logger.info('--------------------');
        await checkData.checkHubspotByEmail(false, 'week', true);
        await timeoutPromise(1000);
        logger.info('--------------------');
        await checkData.checkSalesforceByEmail(false, 'month', true);
        await timeoutPromise(1000);
        logger.info('--------------------');
        await checkData.checkHubspotByEmail(false, 'day');
        await timeoutPromise(1000);
        logger.info(`END TEST AUTOMATION : ${moment().format('LLL')}`);
      } catch (e) {
        await timeoutPromise(3000);
        logger.info(`END TEST AUTOMATION WITH ERRORS:
            ${e.message}
          ${moment().format('LLL')}`);
      }
    });
  } else {
    try {
      console.log('START TEST AUTOMATION MANUAL');
      // await timeoutPromise(1000);
      // await checkData.checkPipedriveByEmail(false, new Date().getDay() ? 'day' : 'month', false, false);
      // await timeoutPromise(1000);
      // console.log('--------------------');
      // await checkData.checkHubspotByEmail(false, 'week', false, false);
      // await timeoutPromise(1000);
      // console.log('--------------------');
      // await checkData.checkSalesforceByEmail(false, 'month', false, false);
      // console.log('DONE');
      // await timeoutPromise(1000);
      // console.log('--------------------');
      // await checkData.checkHubspotByEmail(false, 'day');
      // await timeoutPromise(1000);
      console.log('END TEST AUTOMATION MANUAL');
    } catch (e) {
      await timeoutPromise(3000);
      console.log(`END TEST AUTOMATION WITH ERRORS:
          ${e.message}
        ${moment().format('LLL')}`);
    }
  }
};

exports.cronPisStatus = () => {
  cron.schedule('5 * * * *', async () => {
    await timeoutPromise(2000);
    await Pis.checkStatusPis();
  });
};

exports.cronHubspotWebhooks = () => {
  cron.schedule('*/2 * * * *', async () => {
    await request(config.get('coreUrl'), 'hubspot/check/webhooks', null, 'GET', { Authorization: fixedToken });
  });
};
