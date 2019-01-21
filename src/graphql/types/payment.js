const {
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLFloat,
  GraphQLString,
  GraphQLBoolean,
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
