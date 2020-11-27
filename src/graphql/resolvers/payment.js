const { ObjectID } = require('mongodb');
const config = require('config');

const mongo = require('../../db/mongo');
const utils = require('../utils');
const request = require('../../dataTest/Utils/request');

const databaseName = process.env.databaseH7;
const { fixedToken } = process.env;

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

const getNextSequenceValue = async (sequenceName) => {
  return mongo.findAndModify(
    'heptaward',
    'counters',
    { _id: sequenceName },
    { $inc: { sequenceValue: 1 } },
    { returnOriginal: false, upsert: true },
  );
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

exports.generateInvoiceNumber = async ({ clientCode }) => {
  const organization = await mongo.findOne('heptaward', 'organisations', { clientCode });
  if (!organization) return { invoiceNumber: 'null' };
  const user = await mongo.findOne('heptaward', 'users', { orga_id: organization._id });
  if (!user) return { invoiceNumber: 'null' };
  const { sequenceValue } = await getNextSequenceValue('licenceNumber');

  return {
    invoiceNumber: utils.buildInvoiceNumber(sequenceValue, clientCode),
  };
};

exports.previousInfoInvoice = async ({ clientCode }) => {
  const [invoice] = await mongo.find('heptaward', 'invoices', { clientCode }, { createdAt: -1 }, 1);
  if (!invoice) return null;
  return {
    shipping: invoice.shipping,
    descriptionPlan: invoice.descriptionPlan,
    currency: invoice.currency,
  };
};

exports.previousInvoices = async ({ clientCode }) => {
  const invoices = await mongo.find('heptaward', 'invoices', { clientCode }, { createdAt: -1 });
  return invoices.map(invoice => {
    return {
      ...invoice,
      ...invoice.subscriptions && { descriptionPlan: `${invoice.subscriptions[0].descriptionPlan}/${invoice.subscriptions[1].descriptionPlan}` },
      isPaid: invoice.outsideStripe ? invoice.isPaid : true,
      from: invoice.outsideStripe ? 'custom' : 'stripe',
    };
  });
};

exports.addInvoice = async ({
  clientCode, periodStart, periodEnd, paymentType, currency,
  isPaid, taxPercent, subtotal, quantity, shipping, subscriptions,
  note, notePayment,
}) => {
  const organization = await mongo.findOne('heptaward', 'organisations', { clientCode });
  if (!organization) return { success: false };

  const date = new Date();

  const { sequenceValue } = await getNextSequenceValue(`licenceNumber${process.env.NODE_ENV === 'development' ? 'Dev' : ''}`);

  const subscriptionsParsed = JSON.parse(subscriptions);
  const shippingParsed = JSON.parse(shipping);

  const tax = taxPercent && Number((subtotal * (taxPercent / 100)).toFixed(2));

  const newInvoice = {
    orgaId: organization._id,
    clientCode,
    number: {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      count: sequenceValue,
    },
    creationDate: date.getTime(),
    periodStart,
    periodEnd,
    ...subscriptionsParsed.length === 1 && { descriptionPlan: subscriptionsParsed[0].descriptionPlan, quantity },
    ...subscriptionsParsed.length > 1 && { subscriptions: subscriptionsParsed },
    currency,
    tax,
    taxPercent,
    subtotal,
    total: (subtotal + tax),
    shipping: shippingParsed,
    outsideStripe: true,
    paymentType,
    isPaid: Boolean(isPaid),
    ...note && { note: note.split('\n') },
    ...notePayment && { notePayment: notePayment.split('\n') },
  };

  const invoiceInserted = await mongo.insert('heptaward', `invoices${process.env.NODE_ENV === 'development' ? 'Dev' : ''}`, newInvoice);

  const { locale } = await mongo.findOne('heptaward', 'users', { orga_id: organization._id });

  const dataToReplaceInInvoice = utils.formatInvoiceObject({ ...newInvoice, locale });

  const data = {
    dataToReplace: dataToReplaceInInvoice,
    invoiceId: invoiceInserted._id,
  };
  const body = await request(config.get('coreUrl'), 'webhookInvoices', null, 'POST', { Authorization: fixedToken }, data);

  if (!body || !body.pdfUrl) return { success: false };
  return {
    success: true,
    pdfUrl: body.pdfUrl,
  };
};
