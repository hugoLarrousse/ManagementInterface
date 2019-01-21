const {
  GraphQLNonNull,
  GraphQLString,
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
  resolve: createResolver({ isAuthRequired: false }, (_, args) => {
    return payment.setCoupon(args);
  }),
};
