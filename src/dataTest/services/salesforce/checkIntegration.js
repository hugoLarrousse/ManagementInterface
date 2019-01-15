const { ObjectID } = require('mongodb');

const mongo = require('../../../db/mongo');
const request = require('../../Utils/request');

const {
  salesforceUrlLogin,
  salesforceClientId,
  salesforceClientSecret,
} = process.env;

const isTokenValid = (expirationDate) => Date.now() - 300000 < Number(expirationDate);

const refreshToken = (token) => {
  const queryRefreshToken = `grant_type=refresh_token&refresh_token=${token}&client_secret=${salesforceClientSecret}&client_id=${salesforceClientId}`; // eslint-disable-line
  return request(salesforceUrlLogin, null, queryRefreshToken, 'POST', null, null, true);
};

module.exports = async (integration) => {
  if (integration && isTokenValid(integration.tokenExpiresAt)) {
    return integration;
  }
  const result = await refreshToken(integration.refreshToken);
  if (result && result.access_token) {
    Object.assign(integration, { token: result.access_token, tokenExpiresAt: Date.now() + 7200000 });
    await mongo.updateOne(
      'heptaward',
      'integrations',
      { _id: ObjectID(integration._id) },
      { token: result.access_token, tokenExpiresAt: Date.now() + 7200000 }
    );
  }
  return integration;
};
