
const Utils = require('../utils');

const doublonsActivities = (elements) => {
  try {
    const listID = elements.map(a => a.id);

    const doublons = Utils.duplicatesID(listID);
    return elements.filter(a => {
      if (doublons.includes(a.id.toString())) {
        return a;
      }
      return null;
    });
  } catch (e) {
    throw new Error(`${__filename}
      ${doublonsActivities.name}
      ${e.message}`);
  }
};


const doublonsDeals = (elements) => {
  try {
    const listID = elements.map(a => a.id);

    const doublons = Utils.duplicatesID(listID);

    return elements.filter(a => {
      if (doublons.includes(a.id.toString())) {
        return a;
      }
      return null;
    });
  } catch (e) {
    throw new Error(`${__filename}
      ${doublonsDeals.name}
      ${e.message}`);
  }
};

const doublonsOnPipedrive = (elements, dataType) => {
  return dataType === 'activities' ? doublonsActivities(elements) : doublonsDeals(elements);
};

exports.doublonsOnPipedrive = doublonsOnPipedrive;
