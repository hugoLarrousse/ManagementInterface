const mongo = require('../../db/mongo');

const databaseName = process.env.databaseH7;

const licenceCollection = 'licences';
const planCollection = 'plans';

const CONVERSION_DOLLAR_EURO = 0.85;

const licencePayingCount = mongo.count(databaseName, licenceCollection, {
  planId: { $ne: null },
});
const licenceCount = mongo.count(databaseName, licenceCollection);
const licencesPaid = mongo.find(databaseName, licenceCollection, {
  planId: { $ne: null },
});
const plans = mongo.find(databaseName, planCollection);

const reducer = (accumulator, licence) => {
  if (accumulator[licence.planId]) {
    Object.assign(accumulator, { [licence.planId]: accumulator[licence.planId] + 1 });
  } else {
    Object.assign(accumulator, { [licence.planId]: 1 });
  }
  return accumulator;
};

const normalizeAmountPlan = ({ interval, currency, amount }) => {
  let letAmount = amount;
  letAmount = interval === 'year' ? letAmount / 12 : letAmount;
  letAmount = currency === 'usd' ? letAmount * CONVERSION_DOLLAR_EURO : letAmount;
  return Math.round(letAmount / 100);
};

exports.count = async () => {
  await Promise.all([licencePayingCount, licenceCount, licencesPaid, plans]);
  const planIdCount = (await licencesPaid).reduce(reducer, {});
  const plansUnpromising = await plans;
  const mrr = Object.entries(planIdCount).reduce((accumulator, currentValue) => {
    const planFound = plansUnpromising.find(plan => currentValue[0] === plan._id);
    const amount = normalizeAmountPlan(planFound);
    return accumulator += amount * currentValue[1]; // eslint-disable-line
  }, 0);
  return {
    licencePayingCount,
    licencePayingPercentage: (await licencePayingCount / await licenceCount) * 100,
    mrr,
  };
};
