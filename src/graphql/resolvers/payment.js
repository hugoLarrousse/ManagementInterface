const { ObjectID } = require('mongodb');

const mongo = require('../../db/mongo');

const databaseName = process.env.databaseH7;

const licenceCollection = 'licences';
const planCollection = 'plans';
const couponCollection = 'coupons';

const CONVERSION_DOLLAR_EURO = 0.85;

let coupons = [];

const licenceCount = () => mongo.count(databaseName, licenceCollection);
const licencesPaid = () => mongo.find(databaseName, licenceCollection, {
  planId: { $ne: null },
  isCancel: false,
});

const couponPercentOff = (couponId) => 1 - (Number(coupons.find(coupon => String(coupon._id) === couponId).percent_off) / 100);

const reducerPlan = (accumulator, licence) => {
  if (accumulator[licence.planId]) {
    Object.assign(accumulator, { [licence.planId]: accumulator[licence.planId] + (licence.couponId ? couponPercentOff(licence.couponId) : 1) });
  } else {
    Object.assign(accumulator, { [licence.planId]: (licence.couponId ? couponPercentOff(licence.couponId) : 1) });
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
  const resultLicenceCount = await licenceCount();
  const resultLicencesPaid = await licencesPaid();
  coupons = await mongo.find(databaseName, couponCollection);

  const resultLicencePayingCount = resultLicencesPaid.length;
  const planIdCount = resultLicencesPaid.reduce(reducerPlan, {});
  const plans = await mongo.find(databaseName, planCollection);

  const mrr = Object.entries(planIdCount).reduce((accumulator, currentValue) => {
    const planFound = plans.find(plan => currentValue[0] === plan._id);
    const amount = normalizeAmountPlan(planFound);
    return accumulator += amount * currentValue[1]; // eslint-disable-line
  }, 0);
  return {
    licencePayingCount: resultLicencePayingCount,
    licencePayingPercentage: ((resultLicencePayingCount / resultLicenceCount) * 100).toFixed(2),
    mrr,
  };
};

exports.getCoupons = () => {
  return mongo.find('heptaward', 'coupons');
};

exports.setCoupon = async ({ orgaId, couponId }) => {
  try {
    const licence = await mongo.findOne('heptaward', 'licences', { orgaId: ObjectID(orgaId) });
    if (!licence) throw Error('no licence found');
    if (licence.couponId) throw Error('already has a couponId');
    const result = await mongo.updateOne('heptaward', 'licences', { _id: licence._id }, { couponId });
    if (!result) throw Error('licence not updated');
    return { success: true };
  } catch (e) {
    console.log('e.message :', e.message);
    return { success: false };
  }
};

const getNextSequenceValue = async (sequenceName) => {
  return mongo.findAndModify(
    'heptaward',
    'counters',
    { _id: sequenceName },
    { $inc: { sequenceValue: 1 } },
    { returnOriginal: false, upsert: true },
  );
};

const buildInvoiceNumber = (count, clientCode) => {
  const date = new Date();
  return `${date.getFullYear()}-${date.getMonth() + 1}-${String(count).padStart(5, '0')}${clientCode}`;
};


exports.generateInvoiceNumber = async ({ clientCode }) => {
  const organization = await mongo.findOne('heptaward', 'organisations', { clientCode });
  if (!organization) return { invoiceNumber: 'null' };
  const user = await mongo.findOne('heptaward', 'users', { orga_id: organization._id });
  if (!user) return { invoiceNumber: 'null' };
  const { sequenceValue } = await getNextSequenceValue('licenceNumber');

  return {
    invoiceNumber: buildInvoiceNumber(sequenceValue, clientCode),
  };
};
