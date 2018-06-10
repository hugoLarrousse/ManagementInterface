const jwt = require('jsonwebtoken');
const { ObjectID } = require('mongodb');
const logger = require('../../utils');
const isObject = require('lodash/isObject');
const sha1 = require('sha1');

const mongo = require('../../db/mongo');

const { jwtSecret } = process.env;
const databaseName = process.env.databaseH7;
const collection = 'users';

const makeToken = (user) => {
  if (!isObject(user)) {
    throw new Error('User is not an object');
  }
  const { email, _id } = user;
  if (!email || !_id) {
    throw new Error('User do not provide id or email');
  }
  return jwt.sign(
    {
      _id,
      email,
    },
    jwtSecret
  );
};

const authenticateUser = async (email, password) => {
  if (!email || !password) {
    throw new Error('Email or password not provided');
  }
  const userFound = await mongo.findOne(databaseName, collection, { email });
  if (!userFound) {
    throw new Error('WRONG EMAIL');
  }
  if (userFound.password !== sha1(password)) {
    throw new Error('WRONG PASSWORD');
  }
  return {
    ...userFound,
    token: makeToken(userFound),
  };
};

const pickTokenInHeaders = headers => {
  return headers.authorization || null;
};

const extractTokenData = token => new Promise((resolve, reject) => {
  jwt.verify(token, jwtSecret, (err, data) => {
    if (err) {
      reject(err);
    } else {
      resolve(data);
    }
  });
});

const validateToken = async token => {
  const userData = await extractTokenData(token);
  if (!userData || !userData._id) {
    const err = new Error('SECURITY BREACH : Bad (but jwt compliant) token provided');
    logger.error(__filename, validateToken.name, err.message, err);
    throw err;
  }
  const user = await mongo.findOne(databaseName, collection, { _id: ObjectID(userData._id) });
  if (!user) {
    const err = new Error('SECURITY BREACH : User do not exists based on token');
    logger.error(__filename, validateToken.name, err.message, err);
    throw err;
  }
  return user;
};

exports.authenticateUser = authenticateUser;
exports.pickTokenInHeaders = pickTokenInHeaders;
exports.validateToken = validateToken;
