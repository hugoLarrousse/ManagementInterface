const cron = require('node-cron');
const testPipedriveCtrl = require('../controllers/testPipedrive');
const testHubspotCtrl = require('../controllers/testHubspot');
const logger = require('../Utils/loggerSlack');
const moment = require('moment');

const pipedriveEMails = ['axel.manoukian@moovone.fr'];
const hubspotEmails = ['thomas@paygreen.fr', 'tony@insurge.digital', 'hello@ecommerce-nation.fr'];


const cronTask = async () => {
  try {
    logger.info(`START TEST AUTOMATION : ${moment().format('LLL')}`);
    setTimeout(async () => {
      for (const email of pipedriveEMails) {
        const resultActivities = await testPipedriveCtrl.compareMonthActivities(email);
        const resultDeals = await testPipedriveCtrl.compareMonthDeals(email);
        if (resultActivities && resultActivities.differences) {
          const { differences } = resultActivities;
          if (differences.meetingsDoublons || differences.meetingsUnregistered || differences.callsDoublons || differences.callsUnregistered) {
            logger.error('pipedrive', 'activities', email, 'month', differences);
          }
        }
        if (resultDeals && resultDeals.differences) {
          const { differences } = resultDeals;
          if (differences.opened || differences.won || differences.doublons || differences.unRegistered) {
            logger.error('pipedrive', 'deals', email, 'month', differences);
          }
        }
      }
      for (const email of hubspotEmails) {
        const resultActivities = await testHubspotCtrl.compareActivities(email, 'month');
        const resultDeals = await testHubspotCtrl.compareDeals(email, 'month');
        if (resultActivities) {
          const {
            unregisteredMeetingsEngagement,
            unregisteredCallsEngagement,
            meetingsDoublons,
            callsDoublons,
            ...rest
          } = resultActivities;
          if (unregisteredMeetingsEngagement.length > 0
            || unregisteredCallsEngagement.length > 0
            || meetingsDoublons.length > 0
            || callsDoublons.length > 0) {
            logger.error('hubspot', 'activities', email, 'month', rest);
          }
        }
        if (resultDeals) {
          const {
            nbDealsWonDoublons,
            nbDealsOpenedDoublons,
            nbUnregisteredDealsWon,
            nbUnregisteredDealsOpened,
          } = resultDeals;
          if (nbDealsWonDoublons
            || nbDealsOpenedDoublons
            || nbUnregisteredDealsWon
            || nbUnregisteredDealsOpened) {
            const { hubspotDealsOpened, hubspotDealsWon, ...rest } = resultDeals;
            logger.error('hubspot', 'deals', email, 'month', rest);
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
