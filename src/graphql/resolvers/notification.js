const { ObjectID } = require('mongodb');

const mongo = require('../../db/mongo');


const makeNotification = (userId, message) => {
  return {
    date: new Date(),
    date_timestamp: Date.now(),
    dest_user_id: ObjectID(userId),
    from_user_id: null,
    page: null,
    category: {
      name: 'information',
      type: '',
    },
    parametres: {
      text: message,
      icon: 'icon-info',
    },
    read: false,
  };
};


exports.postNotification = async ({ message, target, userIds }) => {
  try {
    const notifications = [];
    if (target === 'everyone') {
      const users = await mongo.find('heptaward', 'users', { team_id: { $ne: null } });
      for (const user of users) {
        notifications.push(makeNotification(user._id, message));
      }
    } else if (target === 'everyoneWhoPay') {
      const licences = await mongo.find('heptaward', 'licences', { planId: { $ne: null }, isCancel: false });
      const orgaIds = licences.map(l => l.orgaId);
      const users = await mongo.find('heptaward', 'users', { orga_id: { $in: orgaIds } });
      for (const user of users) {
        notifications.push(makeNotification(user._id, message));
      }
    } else if (target === 'team' && userIds.length > 0) {
      for (const userId of userIds) {
        notifications.push(makeNotification(userId, message));
      }
    }
    if (notifications.length > 0) {
      await mongo.insertMany('heptaward', 'notifications', notifications);
    }
    return { success: true };
  } catch (e) {
    console.log('e.messag :', e.messag);
    return { success: false };
  }
};
