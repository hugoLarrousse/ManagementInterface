const { ObjectID } = require('mongodb');

const mongo = require('../../db/mongo');

const databaseName = process.env.databaseH7;

const orgaCollection = 'organisations';
const planCollection = 'plans';
const userCollection = 'users';
const teamCollection = 'teams';
const licenceCollection = 'licences';
const integrationCollection = 'integrations';

const normalizePromise = async (method) => {
  const name = Object.keys(method);

  const result = await Promise.all(Object.values(method));

  const toBeReturn = {};
  result.forEach((res, index) => {
    Object.assign(toBeReturn, { [name[index]]: res });
  });

  return toBeReturn;
};

const findIntegration = (integrations, role) => {
  if (integrations.length > 0) {
    return integrations.reduce((acc, currentValue, index) => {
      if (index === 0) {
        return currentValue.name;
      }
      return `${acc} ${currentValue.name}`;
    }, '');
  } else if (role === 'spectator') {
    return 'spectator';
  }
  return '';
};

const differentFunnelPosition = {
  AUTO_REGISTER: 'auto register',
  ACTIVE: 'confirmed',
  NOT_CONFIRMED_YET: 'not_confirmed_yet',
  INVITED: 'invited',
};

exports.info = async () => {
  const allOrga = await mongo.find(databaseName, orgaCollection);
  const all = [];
  for (const orga of allOrga) {
    const users = mongo.find(databaseName, userCollection, { orga_id: ObjectID(orga._id) });
    const team = mongo.findOne(databaseName, teamCollection, { _id: ObjectID(orga.team_h7_id[0]) });
    const licence = mongo.findOne(databaseName, licenceCollection, { orgaId: ObjectID(orga._id) });
    const result = await normalizePromise({ users, team, licence });

    if (result.users.length === 0) {
      console.log(`orga: ${orga._id} --> no users found`);
      continue; /* eslint no-continue: "off" */
    }

    let plan = {};
    if (result.licence.planId) {
      plan = await mongo
        .findOne(databaseName, planCollection, { _id: result.licence.planId });
    }
    const oldestUser = result.users.find(user =>
      user.create_on === Math.min(...result.users.map(user2 => user2.create_on || Infinity)));

    oldestUser.integrations = await mongo.find(databaseName, integrationCollection, {
      userId: ObjectID(oldestUser._id),
    });
    const integration = oldestUser.integrations.length > 0 ? findIntegration(oldestUser.integrations) : '';
    const youngestUser = result.users.find(user3 =>
      user3.last_connected === Math.max(...result.users.map(user4 => user4.last_connected || 0)));

    all.push({
      orgaId: orga._id,
      companyName: result.team.name,
      subDate: oldestUser.create_on,
      mail: oldestUser.email,
      integration,
      teamSize: result.users.length,
      lastSeen: youngestUser.last_connected || 0,
      plan: plan.nickname || 'Trial',
      endDate: result.licence.expirationDate,
      funnelPosition: oldestUser.integrations.length > 0 && oldestUser.status === 'ACTIVE' ? 'paired' : differentFunnelPosition[oldestUser.status],
    });
  }
  return all;
};
