const doublonsOnEchoes = (h7Elements) => {
  try {
    const duplicated = [];
    const listID = h7Elements.map(a => a.source.id);

    const count = listId => listId.reduce((a, b) => Object.assign(a, {
      [b]: (a[b] || 0) + 1,
    }), {});
    const duplicatesID = dict => Object.keys(dict).filter((a) => dict[a] > 1);

    const doublons = duplicatesID(count(listID));

    h7Elements.forEach(a => {
      if (doublons.includes(a.source.id.toString()) && !duplicated.find(d => d.source.id)) {
        duplicated.push(a);
      }
    });

    return duplicated;
  } catch (e) {
    throw new Error(`${__filename}
      ${doublonsOnEchoes.name}
      ${e.message}`);
  }
};

exports.doublonsOnEchoes = doublonsOnEchoes;
