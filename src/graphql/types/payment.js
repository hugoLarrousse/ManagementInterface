const {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLFloat,
  GraphQLString,
  GraphQLBoolean,
  GraphQLID,
} = require('graphql');


exports.count = new GraphQLObjectType({
  name: 'countPayment',
  fields: {
    licencePayingCount: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    licencePayingPercentage: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
    mrr: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
  },
});

exports.coupons = new GraphQLObjectType({
  name: 'coupons',
  fields: {
    name: {
      type: new GraphQLNonNull(GraphQLString),
    },
    _id: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
});

exports.coupon = new GraphQLObjectType({
  name: 'coupon',
  fields: {
    success: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
  },
});


exports.generateInvoiceNumber = new GraphQLObjectType({
  name: 'generateInvoiceNumber',
  fields: {
    invoiceNumber: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
});

const address = new GraphQLObjectType({
  name: 'address',
  fields: {
    city: {
      type: GraphQLString,
    },
    country: {
      type: GraphQLString,
    },
    line1: {
      type: GraphQLString,
    },
    postal_code: {
      type: GraphQLString,
    },
  },
});

const shipping = new GraphQLObjectType({
  name: 'shipping',
  fields: {
    name: {
      type: GraphQLString,
    },
    address: {
      type: address,
    },
  },
});


exports.previousInfoInvoice = new GraphQLObjectType({
  name: 'previousInfoInvoice',
  fields: {
    shipping: {
      type: shipping,
    },
  },
});

const number = new GraphQLObjectType({
  name: 'number',
  fields: {
    year: {
      type: new GraphQLNonNull(GraphQLString),
    },
    month: {
      type: new GraphQLNonNull(GraphQLString),
    },
    count: {
      type: new GraphQLNonNull(GraphQLFloat),
    },
  },
});

exports.previousInvoices = new GraphQLObjectType({
  name: 'previousInvoices',
  fields: {
    _id: {
      type: new GraphQLNonNull(GraphQLID),
    },
    number: {
      type: new GraphQLNonNull(number),
    },
    descriptionPlan: {
      type: GraphQLString,
    },
    isPaid: {
      type: GraphQLBoolean,
    },
    from: {
      type: GraphQLString,
    },
    pdfUrl: {
      type: new GraphQLNonNull(GraphQLString),
    },
  },
});

exports.addInvoice = new GraphQLObjectType({
  name: 'addInvoice',
  fields: {
    success: {
      type: new GraphQLNonNull(GraphQLBoolean),
    },
    pdfUrl: {
      type: GraphQLString,
    },
  },
});
