const {
  GraphQLNonNull,
  GraphQLString,
  GraphQLBoolean,
  GraphQLFloat,
} = require('graphql');
const type = require('../types');
const { createResolver } = require('../utils');
const payment = require('../resolvers/payment');


exports.setCoupon = {
  description: 'add coupon',
  type: type.payment.coupon,
  args: {
    orgaId: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'orgaId',
    },
    couponId: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'couponId',
    },
  },
  resolve: createResolver({ isAuthRequired: true }, (_, args) => {
    return payment.setCoupon(args);
  }),
};

exports.addInvoiceMutation = {
  description: 'add invoice mutation',
  type: type.payment.addInvoice,
  args: {
    clientCode: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'clientCode',
    },
    periodStart: {
      type: new GraphQLNonNull(GraphQLFloat),
      description: 'periodStart',
    },
    periodEnd: {
      type: new GraphQLNonNull(GraphQLFloat),
      description: 'periodEnd',
    },
    quantity: {
      type: new GraphQLNonNull(GraphQLFloat),
      description: 'quantity',
    },
    currency: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'currency',
    },
    taxPercent: {
      type: GraphQLFloat,
      description: 'taxPercent',
    },
    subtotal: {
      type: new GraphQLNonNull(GraphQLFloat),
      description: 'subtotal',
    },
    shipping: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'shipping stringify',
    },
    subscriptions: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'subscriptions stringify',
    },
    paymentType: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'paymentType',
    },
    isPaid: {
      type: GraphQLBoolean,
      description: 'isPaid',
    },
    note: {
      type: GraphQLString,
      description: 'note',
    },
    notePayment: {
      type: GraphQLString,
      description: 'notePayment',
    },
  },
  resolve: createResolver({ isAuthRequired: true }, (_, args) => {
    return payment.addInvoice(args);
  }),
};
