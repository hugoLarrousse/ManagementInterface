
const { ObjectID } = require('mongodb');

const mongo = require('../../db/mongo');

const databaseName = process.env.databaseH7;
const collection = 'users';

exports.findOneUser = async (_id) => {
  return mongo.findOne(databaseName, collection, { _id: ObjectID(_id) });
};
