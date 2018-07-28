const notRegistered = (sourceElements, h7Elements) => {
  try {
    const listH7 = [];
    const unRegistered = [];

    h7Elements.forEach(element => {
      listH7.push(element.source.id);
    });

    sourceElements.forEach(element => {
      if (!listH7.includes(element.id)) {
        unRegistered.push(element);
      }
    });

    return unRegistered;
  } catch (e) {
    throw new Error(`${__filename}
      ${notRegistered.name}
      ${e.message}`);
  }
};

const doublonsOnH7 = (h7Elements) => {
  try {
    const duplicated = [];
    const listID = h7Elements.map(a => a.id);

    const count = listId => listId.reduce((a, b) => Object.assign(a, {
      [b]: (a[b] || 0) + 1,
    }), {});
    const duplicatesID = dict => Object.keys(dict).filter((a) => dict[a] > 1);

    const doublons = duplicatesID(count(listID));

    h7Elements.forEach(a => {
      if (doublons.includes(a.id.toString())) {
        duplicated.push(a);
      }
    });

    return duplicated;
  } catch (e) {
    throw new Error(`${__filename}
      ${doublonsOnH7.name}
      ${e.message}`);
  }
};

exports.notRegistered = notRegistered;
exports.doublonsOnH7 = doublonsOnH7;
