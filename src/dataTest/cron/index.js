const cron = require('node-cron');
const logger = require('../Utils/loggerSlack');
const moment = require('moment');

const checkData = require('../services');
const config = require('config');

const emails = config.get('emails');

exports.cron = () => {
  cron.schedule('0 3 * * *', async () => {
    try {
      logger.info(`START TEST AUTOMATION : ${moment().format('LLL')}`);
      await checkData.checkPipedriveByEmail(emails.pipedrive);
      await checkData.checkHubspotByEmail(emails.hubspot);
      await checkData.checkSalesforceByEmail(emails.salesforce);
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
