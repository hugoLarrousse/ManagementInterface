const tabDealsCompare = (h7Tab, pidTab) => {
  const excessDeals = [];
  const difference = h7Tab.length - pidTab.length;

  if (difference > 0) {
    const pidIds = pidTab.map(a => a.id);
    h7Tab.forEach(element => {
      if (!pidIds.includes(element.source.id)) {
        excessDeals.push(element);
      }
    });
  } else if (difference < 0) {
    const h7Ids = h7Tab.map(a => a.source.id);
    pidTab.forEach(element => {
      if (!h7Ids.includes(element.id)) {
        excessDeals.push(element);
      }
    });
  }

  return {
    difference,
    excessDeals,
  };
};

exports.tabDealsCompare = tabDealsCompare;
