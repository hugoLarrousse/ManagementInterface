const engagementsNotRegistered = (sourceElements, h7Elements) => {
  try {
    const listH7 = [];
    const unRegistered = [];

    h7Elements.forEach(element => {
      listH7.push(element.source.id);
    });

    sourceElements.forEach(element => {
      if (!listH7.includes(element.engagement.id)) {
        unRegistered.push(element);
      }
    });

    return unRegistered;
  } catch (e) {
    throw new Error(`${__filename}
      ${engagementsNotRegistered.name}
      ${e.message}`);
  }
};

const dealsNotRegistered = (sourceElements, h7Elements) => {
  try {
    const listH7 = [];
    const unRegistered = [];

    h7Elements.forEach(element => {
      listH7.push(element.source.id);
    });

    sourceElements.forEach(element => {
      if (!listH7.includes(element.dealId)) {
        unRegistered.push(element);
      }
    });

    return unRegistered;
  } catch (e) {
    throw new Error(`${__filename}
      ${dealsNotRegistered.name}
      ${e.message}`);
  }
};

const sourceDealsNotRegistered = (sourceElements, h7Elements) => {
  try {
    const listH7 = [];
    const unRegistered = [];

    h7Elements.forEach(element => {
      listH7.push(element.dealId);
    });

    sourceElements.forEach(element => {
      if (!listH7.includes(element.dealId)) {
        unRegistered.push(element);
      }
    });

    return unRegistered;
  } catch (e) {
    throw new Error(`${__filename}
      ${sourceDealsNotRegistered.name}
      ${e.message}`);
  }
};

const sourceEngagementsNotRegistered = (sourceElements, h7Elements) => {
  try {
    const listH7 = [];
    const unRegistered = [];

    h7Elements.forEach(element => {
      listH7.push(element.engagement.id);
    });

    sourceElements.forEach(element => {
      if (!listH7.includes(element.engagement.id)) {
        unRegistered.push(element);
      }
    });

    return unRegistered;
  } catch (e) {
    throw new Error(`${__filename}
      ${sourceEngagementsNotRegistered.name}
      ${e.message}`);
  }
};

const doublonsDealsOnH7 = (h7Elements) => {
  try {
    const duplicated = [];
    const listID = h7Elements.map(a => a.dealId);

    const count = listId => listId.reduce((a, b) => Object.assign(a, {
      [b]: (a[b] || 0) + 1,
    }), {});
    const duplicatesID = dict => Object.keys(dict).filter((a) => dict[a] > 1);

    const doublons = duplicatesID(count(listID));

    h7Elements.forEach(a => {
      if (doublons.includes(a.dealId.toString())) {
        duplicated.push(a);
      }
    });

    return duplicated;
  } catch (e) {
    throw new Error(`${__filename}
      ${doublonsDealsOnH7.name}
      ${e.message}`);
  }
};

const doublonsEngagementsOnH7 = (h7Elements) => {
  try {
    const duplicated = [];
    const listID = h7Elements.map(a => a.engagement.id);

    const count = listId => listId.reduce((a, b) => Object.assign(a, {
      [b]: (a[b] || 0) + 1,
    }), {});
    const duplicatesID = dict => Object.keys(dict).filter((a) => dict[a] > 1);

    const doublons = duplicatesID(count(listID));

    h7Elements.forEach(a => {
      if (doublons.includes(a.engagement.id.toString())) {
        duplicated.push(a);
      }
    });

    return duplicated;
  } catch (e) {
    throw new Error(`${__filename}
      ${doublonsEngagementsOnH7.name}
      ${e.message}`);
  }
};


exports.engagementsNotRegistered = engagementsNotRegistered;
exports.dealsNotRegistered = dealsNotRegistered;
exports.doublonsDealsOnH7 = doublonsDealsOnH7;
exports.doublonsEngagementsOnH7 = doublonsEngagementsOnH7;
exports.sourceDealsNotRegistered = sourceDealsNotRegistered;
exports.sourceEngagementsNotRegistered = sourceEngagementsNotRegistered;
