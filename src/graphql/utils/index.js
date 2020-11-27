const isNumber = require('lodash/isNumber');
const moment = require('moment-timezone');
const {
  GraphQLFloat,
  GraphQLInterfaceType,
  GraphQLNonNull,
} = require('graphql');

const { pickTokenInHeaders, validateToken } = require('../authentication');

const timestampsModelInterfaceType = new GraphQLInterfaceType({
  name: 'timestamps',
  fields: {
    createdAt: {
      type: GraphQLFloat,
    },
    updatedAt: {
      type: GraphQLFloat,
    },
  },
});

const createTimeModelType = () => ({
  createdAt: {
    type: new GraphQLNonNull(GraphQLFloat),
    resolve: parent => parent.createdAt === null // eslint-disable-line
      ? 0 // TODO Remove placeholder and catch the exception
      : isNumber(parent.createdAt)
        ? parent.createdAt
        : moment(parent.createdAt).format('x'),
  },
  updatedAt: {
    type: GraphQLFloat,
    resolve: parent => parent.updatedAt === null // eslint-disable-line
      ? null
      : isNumber(parent.updatedAt)
        ? parent.updatedAt
        : moment(parent.updatedAt).format('x'),
  },
});


const createResolver = ({ isAuthRequired }, action) => async (parent, args, ctx, ast) => {
  const authContext = {
    ...ctx,
  };
  if (isAuthRequired) {
    const token = pickTokenInHeaders(ctx.headers);
    if (!token) throw new Error('BAD_TOKEN_PROVIDED');
    try {
      authContext.currentUser = await validateToken(token);
    } catch (e) {
      throw new Error(e.message);
    }
  }
  return action.call(null, parent, args, authContext, ast);
};

const makePercentage = (first, second) => {
  if (!first || first === 0) {
    return 0;
  }
  if (!second || second === 0) {
    return 0;
  }
  return ((first / second) * 100).toFixed(2);
};

const makeEnumType = mapper => Object.values(mapper)
  .reduce((acc, c) => ({
    ...acc,
    [c]: { value: c },
  }), {});


const buildInvoiceNumber = (count, clientCode, date = new Date()) => {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${String(count).padStart(5, '0')}${clientCode || ''}`;
};

const currencySymbol = {
  eur: '€',
  usd: '$',
  cad: '$',
};

const numeral = (number) => {
  const str = String(Math.round(number) / 100);
  if (!str) return number;
  if (str.includes('.')) return String((number / 100).toFixed(2));
  return str;
};

const formatInvoiceObject = (invoiceInfo) => {
  const { shipping } = invoiceInfo;
  const hasManySubscriptions = Boolean(invoiceInfo.subscriptions);

  return {
    INVOICE_NUMBER: buildInvoiceNumber(invoiceInfo.number.count),
    CLIENT_CODE: invoiceInfo.clientCode,
    CREATION_DATE: moment(invoiceInfo.creationDate).format('D MMMM, YYYY'),
    START_PERIOD: moment(invoiceInfo.periodStart).format('D MMMM, YYYY'),
    END_PERIOD: moment(invoiceInfo.periodEnd).format('D MMMM, YYYY'),
    DESCRIPTION_PLAN_1: !hasManySubscriptions ? invoiceInfo.descriptionPlan : invoiceInfo.subscriptions[0].descriptionPlan,
    DESCRIPTION_PLAN_2: hasManySubscriptions ? invoiceInfo.subscriptions[1].descriptionPlan : '',
    CURRENCY_SYMBOL: currencySymbol[invoiceInfo.currency],
    CURRENCY_WORD: String(invoiceInfo.currency).toUpperCase(),
    QUANTITY_1: !hasManySubscriptions ? invoiceInfo.quantity : invoiceInfo.subscriptions[0].quantity,
    QUANTITY_2: hasManySubscriptions && invoiceInfo.subscriptions[1].quantity,
    TAX_VALUE: numeral(invoiceInfo.tax),
    TAX_PERCENT: invoiceInfo.taxPercent,
    PRICE_1: !hasManySubscriptions
      ? numeral((invoiceInfo.subtotal / invoiceInfo.quantity))
      : numeral((invoiceInfo.subscriptions[0].subtotal / invoiceInfo.subscriptions[0].quantity)),
    PRICE_2: hasManySubscriptions && numeral((invoiceInfo.subscriptions[1].subtotal / invoiceInfo.subscriptions[1].quantity)),
    SUBTOTAL_1: !hasManySubscriptions ? numeral(invoiceInfo.subtotal) : numeral(invoiceInfo.subscriptions[0].subtotal),
    SUBTOTAL_2: hasManySubscriptions && numeral(invoiceInfo.subscriptions[1].subtotal),
    SUBTOTAL_ALL: numeral(invoiceInfo.subtotal),
    TOTAL_1: !hasManySubscriptions
      ? numeral(invoiceInfo.subtotal + Number((invoiceInfo.subtotal * (invoiceInfo.taxPercent / 100))))
      : numeral(invoiceInfo.subscriptions[0].subtotal + Number((invoiceInfo.subscriptions[0].subtotal * (invoiceInfo.taxPercent / 100)))),
    TOTAL_2: hasManySubscriptions
      && numeral(invoiceInfo.subscriptions[1].subtotal + Number((invoiceInfo.subscriptions[1].subtotal * (invoiceInfo.taxPercent / 100)))),
    TOTAL_ALL: numeral(invoiceInfo.total),
    AMOUNT_DUE: invoiceInfo.isPaid ? 0 : numeral(invoiceInfo.total),
    STATUS_PAID: invoiceInfo.isPaid ? (invoiceInfo.locale === 'fr' ? 'PAYÉE' : 'PAID') : (invoiceInfo.locale === 'fr' ? 'À PAYER' : 'TO PAY'), //eslint-disable-line
    SHIPPING_ADDRESS_LINE1: shipping.address.line1,
    SHIPPING_ADDRESS_CITY: shipping.address.city.charAt(0).toUpperCase() + shipping.address.city.slice(1),
    SHIPPING_ADDRESS_COUNTRY: shipping.address.country.charAt(0).toUpperCase() + shipping.address.country.slice(1),
    SHIPPING_ADDRESS_CP: shipping.address.postal_code,
    SHIPPING_NAME: shipping.name,
    CARD_TYPE: invoiceInfo.paymentType, // key to be changed, type can be iban
    MANY_SUBSCRIPTIONS: hasManySubscriptions ? 'true' : 'none',
    NOTE_LINE1: invoiceInfo.note ? invoiceInfo.note[0] || '' : '',
    NOTE_LINE2: invoiceInfo.note ? invoiceInfo.note[1] || '' : '',
    NOTE_LINE3: invoiceInfo.note ? invoiceInfo.note[2] || '' : '',
    PAYMENT_INFO_LINE1: invoiceInfo.notePayment ? invoiceInfo.notePayment[0] || '' : '',
    PAYMENT_INFO_LINE2: invoiceInfo.notePayment ? invoiceInfo.notePayment[1] || '' : '',
    PAYMENT_INFO_LINE3: invoiceInfo.notePayment ? invoiceInfo.notePayment[2] || '' : '',
    LOCALE: invoiceInfo.locale,
  };
};


exports.timestampsModelInterfaceType = timestampsModelInterfaceType;
exports.createTimeModelType = createTimeModelType;
exports.createResolver = createResolver;
exports.makePercentage = makePercentage;
exports.makeEnumType = makeEnumType;
exports.buildInvoiceNumber = buildInvoiceNumber;
exports.formatInvoiceObject = formatInvoiceObject;
