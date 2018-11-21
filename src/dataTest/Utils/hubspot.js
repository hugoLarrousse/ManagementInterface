const requestRetry = require('requestretry');
const { ObjectID } = require('mongodb');

const mongo = require('../../db/mongo');

const urlHubspot = process.env.hubspotUrl;

const request = async (info, authRequest = false) => {
  let options = {};

  if (authRequest) {
    options = {
      url: `${urlHubspot}${info.path}`,
      method: info.method,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      form: info.data,
      json: true,
    };
  } else {
    options = {
      url: `${urlHubspot}${info.path}`,
      method: info.method,
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: info.token,
      },
      json: true,
    };
  }

  try {
    const { error, body } = await requestRetry(options);
    if (error) {
      console.log('error : ', error);
      return null;
    }

    if (body) {
      return body;
    }
    return null;
  } catch (e) {
    throw new Error(`${__filename}
      ${request.name}
      ${e.message}`);
  }
};


  // Fonction de rafraichissement du token du User
const refreshToken = async (integration) => {
  const infos = {
    path: '/oauth/v1/token',
    method: 'POST',
    data: {
      grant_type: process.env.hubspot_grant_type_refresh_token,
      client_id: process.env.hubspot_client_id,
      client_secret: process.env.hubspot_client_secret,
      refresh_token: integration.refreshToken,
      redirect_uri: process.env.hubspot_uri,
    },
  };

  // On lance le rafraichissement du Token
  const hubResult = await request(infos, true);

  if (hubResult && hubResult.access_token) {
    const toUpdate = {
      token: hubResult.access_token,
      refreshToken: hubResult.refresh_token,
      tokenExpiresAt: Date.now() + (hubResult.expires_in * 1000),
    };

    const integrationUpdated = await mongo.updateOne('heptaward', 'integrations', { userId: ObjectID(integration.userId) }, toUpdate);

    if (integrationUpdated) {
      return {
        ...integration,
        ...toUpdate,
      };
    }
    throw new Error('fail update integration');
  } else {
    throw new Error('no hubResult');
  }
};

exports.request = request;
exports.refreshToken = refreshToken;
