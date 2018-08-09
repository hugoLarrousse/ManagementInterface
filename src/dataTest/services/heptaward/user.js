const mongo = require('../../../db/mongo');
const { ObjectID } = require('mongodb');

const getUser = async (email) => {
  try {
    const select = {
      email,
    };

    const result = await mongo.findOne('heptaward', 'users', select);
    if (!result) {
      throw new Error('no user found');
    }

    return result;
  } catch (e) {
    throw new Error(`${__filename}
      ${getUser.name}
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

const getIntegration = async (userId, name) => {
  try {
    const select = {
      userId: ObjectID(userId),
      name,
    };

    const result = await mongo.findOne('heptaward', 'integrations', select);

    if (!result) {
      throw new Error('No integration found');
    }

    return {
      ...result,
      team: result.integrationTeam,
    };
  } catch (e) {
    throw new Error(`${__filename}
      ${getIntegration.name}
      ${e.message}`);
  }
};

exports.getUser = getUser;
exports.getIntegrationTeam = getIntegrationTeam;
exports.getIntegration = getIntegration;
