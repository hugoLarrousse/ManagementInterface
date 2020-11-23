const mongo = require('../../db/mongo');
const Utils = require('../../utils');


exports.deleteUsers = async (email) => {
  try {
    if (!email) {
      throw new Error('No Email');
    }
    const user = await mongo.findOne('heptaward', 'users', email);

    if (!user) {
      throw new Error('No user found');
    }
    await mongo.deleteDoc('heptaward', 'teams', { _id: user.team_id });
    await mongo.deleteDoc('heptaward', 'organisations', { _id: user.orga_id });
    await mongo.deleteDoc('heptaward', 'settings', { orgaId: user.orga_id });
    await mongo.deleteDoc('heptaward', 'licences', { orgaId: user.orga_id });
    await mongo.deleteDoc('heptaward', 'library', { teamId: user.team_id });
    await mongo.deleteMany('heptaward', 'integrations', { orgaId: user.orga_id });
    await mongo.deleteMany('heptaward', 'otherIntegrations', { orgaId: user.orga_id });
    await mongo.deleteMany('heptaward', 'hashtags', { orgaId: user.orga_id });
    await mongo.deleteMany('heptaward', 'slacked', { orgaId: user.orga_id });
    await mongo.deleteMany('heptaward', 'trelloCards', { orgaId: user.orga_id });
    await mongo.deleteMany('heptaward', 'trelloEvents', { orgaId: user.orga_id });
    await mongo.deleteMany('heptaward', Utils.typeToCollection.call, { team_h7_id: user.team_id });
    await mongo.deleteMany('heptaward', Utils.typeToCollection.meeting, { team_h7_id: user.team_id });
    await mongo.deleteMany('heptaward', Utils.typeToCollection.deal, { team_h7_id: user.team_id });
    await mongo.deleteMany('heptaward', 'users', { orga_id: user.orga_id, _id: { $ne: user._id } });
    const user2 = {
      ...user,
      team_id: null,
      orga_id: null,
      role: null,
      default_currency: null,
    };
    await mongo.updateOne('heptaward', 'users', { _id: user._id }, user2);
    return { success: true };
  } catch (e) {
    console.log('e.message :', e.message);
    return { success: false };
  }
};

exports.getTeamsUsers = async () => {
  const result = await Promise.all([mongo.find('heptaward', 'teams'), mongo.find('heptaward', 'users', { team_id: { $ne: null } })]);
  return { teams: result[0], users: result[1] };
};

exports.getTeams = async () => {
  const [licences, teams, organisations] = await Promise.all([
    mongo.find('heptaward', 'licences'),
    mongo.find('heptaward', 'teams'),
    mongo.find('heptaward', 'organisations')]);
  const teamToRemove = [];
  for (const team of teams) {
    const orga = organisations.find(o => String(o.team_h7_id[0]) === String(team._id));
    if (!orga) {
      teamToRemove.push(team._id);
      continue; //eslint-disable-line
    }
    const licence = licences.find(l => String(l.orgaId) === String(orga._id));
    Object.assign(team, { orgaId: orga._id, couponId: licence.couponId });
  }
  return teams.filter(team => !teamToRemove.includes(team._id));
};

exports.getOrganizations = async () => {
  const organisations = await mongo.find('heptaward', 'organisations');
  return organisations.sort((a, b) => a.name.localeCompare(b.name));
};
