const count = listId => listId.reduce((a, b) => Object.assign(a, {
  [b]: (a[b] || 0) + 1,
}), {});

const filter = dict => Object.keys(dict).filter((a) => dict[a] > 1);

exports.duplicatesID = listId => filter(count(listId));
