const { ObjectID } = require('mongodb');
const mongo = require('../../db/mongo');

exports.updateExpirationDate = async ({ orgaId, expirationDate }) => {
  const timestamp = new Date(expirationDate).getTime();
  console.log('timestamp :', typeof timestamp);
  console.log('orgaId :', orgaId);
  let result = null;
  if (timestamp) {
    result = await mongo.updateOne('heptaward', 'licences', { orgaId: ObjectID(orgaId) }, { expirationDate: timestamp });
  }

  return {
    success: Boolean(result),
    orgaId,
    expirationDate,
  };
};
