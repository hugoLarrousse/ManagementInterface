const mongo = require('../../db/mongo');


exports.getByCrm = async (crm) => {
  const crmAutomation = await mongo.findOne('heptaward', 'automation', { crmName: crm });
  if (!crmAutomation || !crmAutomation.emails) throw Error(`no emails found for ${crm} crm`);
  return crmAutomation.emails;
};
