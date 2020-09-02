const tabDealsCompare = (h7Deals, pipedriveDeals) => {
  const excessDeals = [];
  const missingDeals = [];
  const difference = h7Deals.length - pipedriveDeals.length;

  if (difference > 0) {
    const pidIds = pipedriveDeals.map(a => a.id);
    h7Deals.forEach(element => {
      if (!pidIds.includes(element.source.id)) {
        excessDeals.push(element);
      }
    });
  } else if (difference < 0) {
    const h7Ids = h7Deals.map(a => a.source.id);
    pipedriveDeals.forEach(element => {
      if (!h7Ids.includes(element.id)) {
        missingDeals.push(element);
      }
    });
  }

  return {
    difference,
    excessDeals,
    missingDeals,
  };
};

exports.tabDealsCompare = tabDealsCompare;
