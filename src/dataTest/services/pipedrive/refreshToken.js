const { ObjectID } = require('mongodb');

const request = require('../../Utils/request');
const mongo = require('../../../db/mongo');

const pipedriveLoginUrl = 'https://oauth.pipedrive.com';


module.exports = async (integrationInfo) => {
  if (!integrationInfo || !integrationInfo.token) {
    throw new Error('no integrationInfo !!');
  }
  if (!integrationInfo.tokenExpiresAt) {
    throw new Error('no integrationInfo.tokenExpiresAt ');
  }

  if (integrationInfo.tokenExpiresAt < Date.now() + 360000) {
    const data = {
      grant_type: 'refresh_token',
      refresh_token: integrationInfo.refreshToken,
      client_id: process.env.pipedriveClientId,
      client_secret: process.env.pipedriveClientSecret,
    };

    const refreshedTokenInfo = await request(
      pipedriveLoginUrl, 'oauth/token', null, 'POST',
      { 'Content-Type': 'application/x-www-form-urlencoded' }, data, null, true
    );

    if (refreshedTokenInfo && refreshedTokenInfo.access_token) {
      const toUpdate = {
        token: refreshedTokenInfo.access_token,
        refreshToken: refreshedTokenInfo.refresh_token,
        tokenExpiresAt: Date.now() + (refreshedTokenInfo.expires_in * 1000),
      };
      const updatedIntegration = await mongo.updateOne('heptaward', 'integrations', { _id: ObjectID(integrationInfo._id) }, toUpdate);
      if (!updatedIntegration) {
        throw new Error(`fail updatedIntegration _id integration : ${integrationInfo._id}`);
      }
      return updatedIntegration;
    }
    throw new Error('fail refresh token');
  }
  return integrationInfo;
};
