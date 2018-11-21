const mongo = require('../../../db/mongo');
const { ObjectID } = require('mongodb');

const deleteMany = async (elements, database, collection) => {
  elements.forEach(async element => {
    const query = {
      _id: ObjectID(element._id),
    };

    await mongo.deleteDoc(database, collection, query);
  });

  return true;
};

const deleteDealsDoublonsEchoes = async (elements, database, collection) => {
  const units = [];
  const doublons = [];

  elements.forEach(element => {
    if (!element.link_activitie || String(element._id) === String(element.link_activitie)) {
      units.push(element);
    } else {
      doublons.push(element);
    }
  });
  await deleteMany(doublons, database, collection);
  return doublons;
};

const deleteActivitiesDoublonsEchoes = async (elements, database, collection) => {
  const cache = [];
  const doublons = [];

  elements.forEach(element => {
    if (cache.includes(element.source.id.toString())) {
      doublons.push(element);
    } else {
      cache.push(element.source.id.toString());
    }
  });

  await deleteMany(doublons, database, collection);

  return doublons;
};

const deleteDataDoublonsPipedrive = async (elements, database, collection) => {
  const cache = [];
  const doublons = [];

  elements.forEach(element => {
    if (cache.includes(element.id.toString())) {
      doublons.push(element);
    } else {
      cache.push(element.id.toString());
    }
  });

  await deleteMany(doublons, database, collection);

  return doublons;
};

const deleteActivitiesById = async (activityIds) => {
  const filter = {
    _id: { $in: activityIds },
  };
  await mongo.softDeleteMany('heptaward', 'echoes', filter);
};

exports.deleteDealsDoublonsEchoes = deleteDealsDoublonsEchoes;
exports.deleteActivitiesDoublonsEchoes = deleteActivitiesDoublonsEchoes;
exports.deleteDataDoublonsPipedrive = deleteDataDoublonsPipedrive;
exports.deleteActivitiesById = deleteActivitiesById;
