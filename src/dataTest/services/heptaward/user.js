const mongo = require('../../../db/mongo');
const hubspot = require('../../Utils/hubspot');
const { ObjectID } = require('mongodb');

//
const getUser = async (email) => {
  try {
    const select = {
      email,
    };

    const result = await mongo.findOne('heptaward', 'users', select);

    return result;
  } catch (e) {
    throw new Error(`${__filename}
      ${getUser.name}
      ${e.message}`);
  }
};

const getPipedriveToken = async (user) => {
  try {
    let token = null;

    user.integrations.forEach((integration) => {
      if (integration.name === 'Pipedrive') {
        token = integration.informations.pipedrive_token;
      }
    });

    return token;
  } catch (e) {
    throw new Error(`${__filename}
      ${getPipedriveToken.name}
      ${e.message}`);
  }
};

const getHubspotToken = async (user) => {
  try {
    let token = null;

    user.integrations.forEach(async (integration) => {
      if (integration.name === 'Hubspot') {
        if (integration.informations.hubspot_token_expires_at < Date.now()) {
          token = await hubspot.refreshToken(integration.informations.hubspot_refresh_token);
        } else {
          token = integration.informations.hubspot_access_token;
        }
      }
    });

    return token;
  } catch (e) {
    throw new Error(`${__filename}
      ${getHubspotToken.name}
      ${e.message}`);
  }
};

const getIntegrationToken = async (userId, name) => {
  try {
    let token = null;
    const select = {
      userId: ObjectID(userId),
      name,
    };

    const result = await mongo.findOne('heptaward', 'integrations', select);

    if (result.tokenExpiresAt) {
      if (result.tokenExpiresAt < Date.now()) {
        token = await hubspot.refreshToken(result.refreshToken);
      } else {
        token = result.token;
      }
    } else {
      token = result.token;
    }

    return token;
  } catch (e) {
    throw new Error(`${__filename}
      ${getIntegrationToken.name}
      ${e.message}`);
  }
};

const getIntegrationTeam = async (userId, name) => {
  try {
    const select = {
      userId: ObjectID(userId),
      name,
    };

    const result = await mongo.findOne('heptaward', 'integrations', select);

    return result.integrationTeam;
  } catch (e) {
    throw new Error(`${__filename}
      ${getIntegrationTeam.name}
      ${e.message}`);
  }
};

//
const getIntegration = async (userId, name) => {
  try {
    let token = null;
    const select = {
      userId: ObjectID(userId),
      name,
    };

    const result = await mongo.findOne('heptaward', 'integrations', select);

    if (result && result.tokenExpiresAt) {
      if (result.tokenExpiresAt < Date.now()) {
        token = await hubspot.refreshToken(result.refreshToken);
      } else {
        token = result.token;
      }
    } else {
      token = result.token;
    }

    return {
      token,
      team: result.integrationTeam,
    };
  } catch (e) {
    throw new Error(`${__filename}
      ${getIntegration.name}
      ${e.message}`);
  }
};

exports.getUser = getUser;
exports.getPipedriveToken = getPipedriveToken;
exports.getHubspotToken = getHubspotToken;
exports.getIntegrationToken = getIntegrationToken;
exports.getIntegrationTeam = getIntegrationTeam;
exports.getIntegration = getIntegration;
