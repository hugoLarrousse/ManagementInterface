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
  return (first / second) * 100;
};

exports.timestampsModelInterfaceType = timestampsModelInterfaceType;
exports.createTimeModelType = createTimeModelType;
exports.createResolver = createResolver;
exports.makePercentage = makePercentage;
