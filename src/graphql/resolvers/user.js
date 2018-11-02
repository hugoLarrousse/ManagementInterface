const mongo = require('../../db/mongo');


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
    await mongo.deleteMany('heptaward', 'integrations', { orgaId: user.orga_id });
    await mongo.deleteMany('heptaward', 'hashtags', { orgaId: user.orga_id });
    await mongo.deleteMany('heptaward', 'echoes', { orga_h7_id: user.orga_id });
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
