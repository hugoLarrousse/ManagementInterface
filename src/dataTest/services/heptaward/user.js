const mongo = require('../../../db/mongo');
const { ObjectID } = require('mongodb');
const join = require('lodash/join');

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

const getIntegrationOrga = async (orgaId, name) => {
  try {
    const select = {
      orgaId: ObjectID(orgaId),
      name,
    };

    return mongo.find('heptaward', 'integrations', select);
  } catch (e) {
    throw new Error(`${__filename}
      ${getIntegrationOrga.name}
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

exports.getSettingsForPipedrive = async (orgaId) => {
  let meetingTypes = ['meeting', 'lunch'];
  let callTypes = ['call'];
  try {
    const select = {
      orgaId: ObjectID(orgaId),
    };
    const result = await mongo.findOne('heptaward', 'settings', select);

    if (result && result.pipedriveMeetingTypes && result.pipedriveCallTypes) {
      meetingTypes = result.pipedriveMeetingTypes;
      callTypes = result.pipedriveCallTypes;
    }

    return {
      meetingTypes: join(meetingTypes, ','),
      callTypes: join(callTypes, ','),
      pipelines: result && result.pipedrivePipelines,
      activitiesNoDeal: result.pipedriveActivitiesNoDeal,
    };
  } catch (e) {
    throw new Error(`${__filename}
    getSettingsForPipedrive
      ${e.message}`);
  }
};

exports.getSalesforceRestriction = async (orgaId) => {
  try {
    const select = {
      orgaId: ObjectID(orgaId),
    };
    const result = await mongo.findOne('heptaward', 'settings', select);

    return result && result.salesforceRestriction && { restrictions: result.salesforceRestriction };
  } catch (e) {
    throw new Error(`${__filename}
    getSettings
      ${e.message}`);
  }
};

exports.getUser = getUser;
exports.getIntegrationOrga = getIntegrationOrga;
exports.getIntegration = getIntegration;
