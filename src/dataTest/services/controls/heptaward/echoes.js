const h7Echoes = require('../../heptaward/echoes');

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
    console.log('orga_h7_id or user_h7_id different :', doc1.user_h7_id, doc2.user_h7_id);
    const timestampDiff = doc1.register_timestamp - doc2.register_timestamp;
    if (points1 === points2 && (timestampDiff < 1000 && timestampDiff > -1000)) {
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
  } else {
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
  if (points1 === points2 && (timestampDiff < 1000 && timestampDiff > -1000)) {
    return doc1.register_timestamp - doc2.register_timestamp > 0 ? doc2._id : doc1._id;
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
          await h7Echoes.deleteDoublonById(idToDelete);
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
          await h7Echoes.deleteDoublonById(idToDelete);
          console.log('idDeleted :', idToDelete);
        }
      }
    }
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
          await h7Echoes.deleteDoublonById(idToDelete);
          console.log('idDeleted :', idToDelete);
        }
      }
    }
  }
  if (callDoublons && callDoublons.length > 0) {
    console.log('call doublons');
    for (const callDoublon of callDoublons) {
      const meetings = await h7Echoes.getActivitiesDoublons(callDoublon.source.team_id, callDoublon.source.id, 'call');
      if (meetings.length < 2) {
        console.log('Error no doublons calls :');
      } else if (meetings.length > 2) {
        console.log('Call Doublon more than 2...');
      } else {
        const idToDelete = compareDoublons(meetings[0], meetings[1]);
        if (idToDelete) {
          await h7Echoes.deleteDoublonById(idToDelete);
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
          await h7Echoes.deleteDoublonById(idToDelete);
          console.log('idDeleted :', idToDelete);
        }
      }
    }
  }
};
