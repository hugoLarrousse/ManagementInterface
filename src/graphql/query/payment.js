const { GraphQLList, GraphQLNonNull, GraphQLString } = require('graphql');

const type = require('../types');
const payment = require('../resolvers/payment');
const { createResolver } = require('../utils');

exports.count = {
  type: type.payment.count,
  description: 'Analytics about users',
  resolve: createResolver(
    { isAuthRequired: true },
    () => {
      return payment.count();
    }
  ),
};

exports.getCoupons = {
  type: new GraphQLList(type.payment.coupons),
  description: 'Get All coupons',
  resolve: createResolver(
    { isAuthRequired: true },
    () => {
      return payment.getCoupons();
    }
  ),
};

exports.generateInvoiceNumberQuery = {
  type: type.payment.generateInvoiceNumber,
  description: 'Generate Invoice Number',
  args: {
    clientCode: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'client Code',
    },
  },
  resolve: createResolver(
    { isAuthRequired: true },
    (_, args) => {
      return payment.generateInvoiceNumber(args);
    }
  ),
};

exports.previousInfoInvoiceQuery = {
  type: type.payment.previousInfoInvoice,
  description: 'Get info previous invoice',
  args: {
    clientCode: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'client Code',
    },
  },
  resolve: createResolver(
    { isAuthRequired: true },
    (_, args) => {
      return payment.previousInfoInvoice(args);
    }
  ),
};

exports.previousInvoicesQuery = {
  type: new GraphQLList(type.payment.previousInvoices),
  description: 'Get previous invoices',
  args: {
    clientCode: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'client Code',
    },
  },
  resolve: createResolver(
    { isAuthRequired: true },
    (_, args) => {
      return payment.previousInvoices(args);
    }
  ),
};
