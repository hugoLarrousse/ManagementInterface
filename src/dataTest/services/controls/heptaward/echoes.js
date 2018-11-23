const h7Echoes = require('../heptaward/echoes');

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

const compareDoublons = (doc1, doc2) => {
  let points1 = 0;
  let points2 = 0;
  if (String(doc1.orga_h7_id) !== String(doc2.orga_h7_id) || String(doc1.user_h7_id) !== String(doc2.user_h7_id)) {
    console.log('orga_h7_id or user_h7_id different :');
    return null;
  }
  if (doc1.type !== doc2.type) {
    console.log('type is different');
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
  console.log('points1 :', points1);
  console.log('doc1 :', doc1._id);
  console.log('points2 :', points2);
  console.log('doc2 :', doc2._id);
  return null;
};

exports.manageDoublons = async (meetingsDoublons, callDoublons, doublons) => {
  console.log('IN MANAGE DOUBLONS');

  if (meetingsDoublons && meetingsDoublons.length > 0) {
    for (const meetingDoublon of meetingsDoublons) {
      const meetings = await h7Echoes.getActivitiesDoublons(meetingDoublon.source.team_id, meetingDoublon.source.id, 'meeting');
      if (meetings.length < 2) {
        console.log('Error no doublons meetings :');
      } else if (meetings.length > 2) {
        console.log('Meeting Doublon more than 2...');
      } else {
        const idToDelete = compareDoublons(meetings[0], meetings[1]);
        if (idToDelete) {
          console.log('idToDelete :', idToDelete);
          // delete
        }
      }
    }
  }
  if (callDoublons && callDoublons.length > 0) {
    for (const callDoublon of callDoublons) {
      const meetings = await h7Echoes.getActivitiesDoublons(callDoublon.source.team_id, callDoublon.source.id, 'meeting');
      if (meetings.length < 2) {
        console.log('Error no doublons calls :');
      } else if (meetings.length > 2) {
        console.log('Call Doublon more than 2...');
      } else {
        const idToDelete = compareDoublons(meetings[0], meetings[1]);
        if (idToDelete) {
          console.log('idToDelete :', idToDelete);
          // delete
        }
      }
    }
  }
  if (doublons) {
    // console.log('doublons :', doublons);
  }
};
