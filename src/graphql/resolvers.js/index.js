
const { ObjectID } = require('mongodb');

const mongo = require('../../db/mongo');
const { authenticateUser } = require('../authentification');

const databaseName = process.env.databaseH7;
const collection = 'users';

const findOneUser = async (_id) => {
  return mongo.findOne(databaseName, collection, { _id: ObjectID(_id) });
};

const jwtLogin = async ({ email, password }) => {
  console.log('email :', email);
  console.log('password :', password);
  try {
    return await authenticateUser(email, password);
  } catch (e) {
    throw new Error(e.message);
  }
};

exports.findOneUser = findOneUser;
exports.jwtLogin = jwtLogin;
