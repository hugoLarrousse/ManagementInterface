const h7Echoes = require('../../heptaward/echoes');
const pipedrive = require('../../pipedrive/pipedrive');

const duplicatesID = dict => Object.keys(dict).filter((a) => dict[a] > 1);

exports.doublonsOnEchoes = (h7Elements) => {
  try {
    const duplicated = [];
    const listID = h7Elements.map(a => a.source.id);

    const count = listId => listId.reduce((a, b) => Object.assign(a, {
      [b]: (a[b] || 0) + 1,
    }), {});

    const doublons = duplicatesID(count(listID));

    h7Elements.forEach(a => {
      if (doublons.includes(a.source.id.toString()) && !duplicated.find(d => String(d.source.id) === String(a.source.id))) {
        duplicated.push(a);
      }
    });
    return duplicated;
  } catch (e) {
    throw new Error(`${__filename}
      doublonsOnEchoes
      ${e.message}`);
  }
};

const compareDoublons = (doc1, doc2, isDoublon) => {
  let points1 = 0;
  let points2 = 0;
  if (String(doc1.orga_h7_id) !== String(doc2.orga_h7_id) || String(doc1.user_h7_id) !== String(doc2.user_h7_id)) {
    const timestampDiff = doc1.register_timestamp - doc2.register_timestamp;
    if (timestampDiff < 1000 && timestampDiff > -1000) {
      return doc1.register_timestamp - doc2.register_timestamp > 0 ? doc2._id : doc1._id;
    }
    return null;
  }
  // check updatedAt
  if (doc1.updatedAt) {
    points1 += 1;
  }
  if (doc2.updatedAt) {
    points2 += 1;
  }
  if (doc1.updatedAt && doc2.updatedAt) {
    if (doc1.updatedAt > doc2.updatedAt) {
      points1 += 1;
    } else {
      points2 += 1;
    }
  }

  // check createdAt
  if (doc1.createdAt > doc2.createdAt) {
    points1 += 1;
  } else if (doc1.createdAt < doc2.createdAt) {
    points2 += 1;
  }

  // check points
  if (points1 > points2 + 1) {
    return doc2._id;
  }
  if (points2 > points1 + 1) {
    return doc1._id;
  }
  if (isDoublon) {
    return (points1 > points2 && doc2._id) || (points2 > points1 && doc1._id) || null;
  }
  const timestampDiff = doc1.register_timestamp - doc2.register_timestamp;

  if (points1 === points2 && (timestampDiff < 20 && timestampDiff > -20)) {
    return doc1.register_timestamp - doc2.register_timestamp > 0 ? doc2._id : doc1._id;
  }

  if ([0, 1].includes(points1) && [0, 1].includes(points2) && (timestampDiff < 10 && timestampDiff > -10)) {
    return doc1.register_timestamp - doc2.register_timestamp > 0 ? doc2._id : doc1._id;
  }

  if (doc1.updatedAt && !doc2.updatedAt && points1 >= points2) {
    return doc2._id;
  }
  if (doc1.updatedAt && !doc2.updatedAt && points2 >= points1) {
    return doc1._id;
  }

  return null;
};

exports.manageDoublonsDeals = async (openedDoublons, wonDoublons) => {
  if (openedDoublons && openedDoublons.length > 0) {
    console.log('openedDoublons is real');
    for (const openedDoublon of openedDoublons) {
      const dealsOpened = await h7Echoes.getActivitiesDoublons(openedDoublon.source.team_id, openedDoublon.source.id, 'deal-opened');

      if (dealsOpened.length < 2) {
        console.log('Error no doublons meetings :');
      } else if (dealsOpened.length > 2) {
        console.log('Meeting Doublon more than 2...');
      } else {
        const idToDelete = compareDoublons(dealsOpened[0], dealsOpened[1]);
        if (idToDelete) {
          await h7Echoes.deleteDoublonById(idToDelete, 'deal-opened');
          console.log('idDeleted :', idToDelete);
        }
      }
    }
  }
  if (wonDoublons && wonDoublons.length > 0) {
    console.log('wonDoublons doublons');
    for (const wonDoublon of wonDoublons) {
      const dealsWon = await h7Echoes.getActivitiesDoublons(wonDoublon.source.team_id, wonDoublon.source.id, 'meeting');
      if (dealsWon.length < 2) {
        console.log('Error no wonDoublons :');
      } else if (dealsWon.length > 2) {
        console.log('Call Doublon more than 2...');
      } else {
        const idToDelete = compareDoublons(dealsWon[0], dealsWon[1]);
        if (idToDelete) {
          await h7Echoes.deleteDoublonById(idToDelete, 'deal-won');
          console.log('idDeleted :', idToDelete);
        }
      }
    }
  }
};

const manageTooManyDoublons = async (activities, type) => {
  const activitiesFiltered = activities.filter(activity => !activity.updatedAt);
  if (activitiesFiltered.length + 1 === activities.length) {
    await h7Echoes.deleteDoublonsById(activitiesFiltered.map(a => a._id), type);
  } else {
    console.log(activitiesFiltered.length, activities.length);
  }
};

exports.manageDoublonsActivities = async (meetingsDoublons, callDoublons, doublons) => {
  if (meetingsDoublons && meetingsDoublons.length > 0) {
    console.log('meeting doublons');
    for (const meetingDoublon of meetingsDoublons) {
      const meetings = await h7Echoes.getActivitiesDoublons(meetingDoublon.source.team_id, meetingDoublon.source.id, 'meeting');
      if (meetings.length < 2) {
        console.log('Error no doublons meetings :');
      } else if (meetings.length > 2) {
        console.log('Meeting Doublon more than 2...');
      } else {
        console.log('meetings :', meetings);
        const idToDelete = compareDoublons(meetings[0], meetings[1]);
        if (idToDelete) {
          await h7Echoes.deleteDoublonById(idToDelete, 'meeting');
          console.log('idDeleted :', idToDelete);
        }
      }
    }
  }
  if (callDoublons && callDoublons.length > 0) {
    console.log('call doublons');
    for (const callDoublon of callDoublons) {
      const calls = await h7Echoes.getActivitiesDoublons(callDoublon.source.team_id, callDoublon.source.id, 'call');
      if (calls.length < 2) {
        console.log('Error no doublons calls :');
      } else if (calls.length > 2) {
        await manageTooManyDoublons(calls, 'calls');
      } else {
        const idToDelete = compareDoublons(calls[0], calls[1]);
        if (idToDelete) {
          await h7Echoes.deleteDoublonById(idToDelete, 'call');
          console.log('idDeleted :', idToDelete);
        }
      }
    }
  }
  if (doublons && doublons.length > 0) {
    console.log('doublons');
    for (const doublon of doublons) {
      const activities = await h7Echoes.getActivitiesDoublons(doublon.source.team_id, doublon.source.id);
      if (activities.length < 2) {
        console.log('Error no doublons :');
      } else if (activities.length > 2) {
        console.log('Call Doublon more than 2...');
      } else {
        const idToDelete = compareDoublons(activities[0], activities[1], true);
        if (idToDelete) {
          await h7Echoes.deleteDoublonById(idToDelete, activities.find(a => String(a._id) === String(idToDelete).type));
          console.log('idDeleted :', idToDelete);
        }
      }
    }
  }
};

exports.manageFalseWonDealsPipedrive = async (deals, integration) => {
  for (const deal of deals) {
    const dealFound = await pipedrive.getDealById(deal.source.id, integration.token, Boolean(integration.refreshToken));
    if (dealFound.data.status !== 'won') {
      await h7Echoes.softDelete({ _id: deal._id }, 'deals');
    }
  }
};

exports.managePotentialDeletedDeals = async (deals, integration) => {
  for (const deal of deals) {
    const dealFound = await pipedrive.getDealById(deal.source.id, integration.token, Boolean(integration.refreshToken));
    if (dealFound.data.deleted) {
      await h7Echoes.softDelete({ _id: deal._id }, 'deals');
    }
  }
};

exports.manageDoublonsPipedrive = async (deals, integration) => {
  for (const deal of deals) {
    const dealFound = await pipedrive.getDealById(deal.source.id, integration.token, Boolean(integration.refreshToken));
    if (dealFound.data.status !== 'won') {
      await h7Echoes.softDelete({ _id: deal._id }, 'deals');
    }
  }
};
