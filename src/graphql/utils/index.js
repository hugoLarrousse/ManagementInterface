const isNumber = require('lodash/isNumber');
const moment = require('moment-timezone');
const jwt = require('jsonwebtoken');
const { ObjectID } = require('mongodb');
const logger = require('../../utils');

const mongo = require('../../db/mongo');

const JWT_SECRET = process.env.jwtSecret;

const {
  GraphQLFloat,
  GraphQLInterfaceType,
  GraphQLNonNull,
} = require('graphql');

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

const pickTokenInHeaders = headers => {
  return headers.authorization || null;
};

const extractTokenData = token => new Promise((resolve, reject) => {
  jwt.verify(token, JWT_SECRET, (err, data) => {
    if (err) {
      reject(err);
    } else {
      resolve(data);
    }
  });
});

const validateToken = async token => {
  const userData = await extractTokenData(token);
  if (!userData || !userData.id) {
    const err = new Error('SECURITY BREACH : Bad (but jwt compliant) token provided');
    logger.error(__filename, validateToken.name, err.message, err);
    throw err;
  }
  const user = await mongo.findOne({ _id: ObjectID(userData.id) });
  if (!user) {
    const err = new Error('SECURITY BREACH : User do not exists based on token');
    logger.error(__filename, validateToken.name, err.message, err);
    throw err;
  }
  return user;
};

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

exports.timestampsModelInterfaceType = timestampsModelInterfaceType;
exports.createTimeModelType = createTimeModelType;
exports.createResolver = createResolver;
