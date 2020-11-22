const mongo = require('../../db/mongo');

const { makePercentage } = require('../utils');

const databaseName = process.env.databaseH7;
const integrationCollection = 'integrations';

const countPerCRM = (integrations, crmName) => {
  return (new Set(integrations.filter(i => i.name === crmName).map(j => String(j.orgaId)))).size;
};


exports.count = async () => {
  const integrations = await mongo.find(databaseName, integrationCollection, {
    token: {
      $ne: null,
    },
  });
  const integrationsNoCRM = await mongo.find(databaseName, integrationCollection, { name: 'NoCRM' });

  const countPipedrive = countPerCRM(integrations, 'Pipedrive');
  const countHubspot = countPerCRM(integrations, 'Hubspot');
  const countSalesforce = countPerCRM(integrations, 'Salesforce');
  const countAsana = countPerCRM(integrations, 'Asana');
  const countNoCRM = (new Set(integrationsNoCRM.map(i => String(i.orgaId)))).size;

  const integrationTotal = countPipedrive + countHubspot + countSalesforce + countAsana + countNoCRM;
  return {
    pipedriveCount: countPipedrive || 0,
    pipedrivePercentage: makePercentage(countPipedrive, integrationTotal),
    hubspotCount: countHubspot || 0,
    hubspotPercentage: makePercentage(countHubspot, integrationTotal),
    salesforceCount: countSalesforce || 0,
    salesforcePercentage: makePercentage(countSalesforce, integrationTotal),
    asanaCount: countAsana || 0,
    asanaPercentage: makePercentage(countAsana, integrationTotal),
    noCRMCount: countNoCRM || 0,
    noCRMPercentage: makePercentage(countNoCRM, integrationTotal),
  };
};
