const moment = require('moment');

const logger = require('../../dataTest/Utils/loggerSlack');
const checkData = require('../../dataTest/services');


const launchTests = async () => {
  try {
    logger.info(`START TEST AUTOMATION FROM JAMES: ${moment().format('LLL')}`);
    await checkData.checkPipedriveByEmail();
    await checkData.checkHubspotByEmail();
    await checkData.checkSalesforceByEmail();
    setTimeout(() => {
      logger.info(`END TEST AUTOMATION FROM JAMES: ${moment().format('LLL')}`);
    }, 3000);
  } catch (e) {
    logger.info(`END TEST AUTOMATION WITH ERRORS: (JAMES) ${moment().format('LLL')}`);
  }
};

exports.allData = async () => {
  launchTests();
  return {
    inProgress: true,
  };
};

const crmFunction = {
  pipedrive: checkData.checkPipedriveByEmail,
  hubspot: checkData.checkHubspotByEmail,
  salesforce: checkData.checkSalesforceByEmail,
};

exports.data = async ({ email, crmName }) => {
  const crmNameLOwerCase = crmName.toLowerCase();
  const { resultActivities, resultDeals } = await crmFunction[crmNameLOwerCase](true, null, null, null, null, [email]);

  return {
    meetings: {
      crm: resultActivities[`${crmNameLOwerCase}Meetings`].ndActivities,
      heptaward: resultActivities.heptawardMeetings.ndActivities,
    },
    calls: {
      crm: resultActivities[`${crmNameLOwerCase}Calls`].ndActivities,
      heptaward: resultActivities.heptawardCalls.ndActivities,
    },
    dealOpened: {
      crm: resultDeals[`${crmNameLOwerCase}Opened`].count,
      heptaward: resultDeals.heptawardOpenedDeals.ndDeals,
    },
    dealWon: {
      crm: resultDeals[`${crmNameLOwerCase}Won`].count,
      heptaward: resultDeals.heptawardWonDeals.ndDeals,
    },
  };
};
