const { MongoClient } = require('mongodb');
const config = require('config');

const {
  addUpdatedAtToModel,
  addCreatedAtToModel,
  softDeleteRetrieveCondition,
} = require('./utils/mongoHelper');
const logger = require('../utils');

const poolSize = config.get('poolSize');

let mongodbConnect = null;

const createConnection = async () => {
  try {
    mongodbConnect = await MongoClient.connect(process.env.dbServer2, { poolSize: poolSize || 80, useNewUrlParser: true, useUnifiedTopology: true });
    return 1;
  } catch (e) {
    logger.error(__filename, 'createConnection', e.message);
    return 0;
  }
};

const closeConnection = async () => mongodbConnect && mongodbConnect.close();

const insert = async (databaseName, collectionName, doc) => {
  const docToSave = addCreatedAtToModel(doc);
  const response = await mongodbConnect.db(databaseName).collection(collectionName).insertOne(docToSave);
  let insertedDoc;
  if (response.ops.length > 0) {
    [insertedDoc] = response.ops;
  } else {
    logger.errorDb(__filename, insert.name, databaseName, collectionName, 'Unable to insert', null, doc);
  }
  return insertedDoc;
};

const insertMany = async (databaseName, collectionName, docs) => {
  const docsToSave = docs.map(doc => addCreatedAtToModel(doc));
  const response = await mongodbConnect.db(databaseName).collection(collectionName).insertMany(docsToSave);
  if (response.ops.length > 0) {
    return response.ops;
  }
  logger.errorDb(__filename, insert.name, databaseName, collectionName, 'Unable to insert', null, docsToSave);
  return null;
};

const findAndModify = async (databaseName, collectionName, query, toUpdate, options) => {
  const docFoundAndModified = await mongodbConnect.db(databaseName).collection(collectionName).findOneAndUpdate(query, toUpdate, options);
  if (docFoundAndModified.ok === 1) {
    return docFoundAndModified.value;
  }
  return null;
};

const updateOne = async (databaseName, collectionName, query = {}, doc, options = {}, noNeedSet) => {
  const docToUpdate = noNeedSet ? doc : { $set: addUpdatedAtToModel(doc) };
  const docUpdated = await mongodbConnect.db(databaseName).collection(collectionName)
    .findOneAndUpdate(
      {
        ...query,
        ...softDeleteRetrieveCondition,
      },
      docToUpdate,
      {
        ...options,
        returnOriginal: false,
      }
    );
  return docUpdated.value;
};

const update = async (databaseName, collectionName, query = {}, doc, options = {}) => {
  const docToUpdate = { $set: addUpdatedAtToModel(doc) };
  const updated = await mongodbConnect.db(databaseName).collection(collectionName)
    .updateMany(
      {
        ...query,
        ...softDeleteRetrieveCondition,
      },
      docToUpdate,
      {
        ...options,
        returnOriginal: false,
      }
    );
  if (!options.multi) {
    logger.errorDb(__filename, update.name, databaseName, collectionName, `Unable to update, query: ${JSON.stringify(query)}`);
  }
  return updated.result;
};

const softDelete = async (databaseName, collectionName, query = {}) => updateOne(databaseName, collectionName, query, { deletedAt: Date.now() });

const softDeleteMany = async (databaseName, collectionName, query = {}) => update(
  databaseName,
  collectionName, query, { deletedAt: Date.now() }, { multi: true }
);

const deleteDoc = async (databaseName, collectionName, query) => {
  const deleted = await mongodbConnect.db(databaseName).collection(collectionName).remove(query);
  if (deleted.result.ok === 1 && deleted.result.n >= 1) {
    return true;
  }
  logger.errorDb(__filename, deleteDoc.name, databaseName, collectionName, 'Unable to delete', null, query);
  return false;
};

const findOne = (databaseName, collectionName, query = {}, deleted) => {
  return mongodbConnect.db(databaseName).collection(collectionName).findOne({ ...!deleted && softDeleteRetrieveCondition, ...query });
};

const find = async (databaseName, collectionName, query = {}, sort = {}, limit = 0, offset = 0, deleted) => {
  const docs = await mongodbConnect.db(databaseName).collection(collectionName)
    .find({
      ...!deleted && softDeleteRetrieveCondition,
      ...query,
    })
    .sort(sort)
    .limit(Number(limit))
    .skip(Number(offset))
    .toArray();
  return docs;
};

const count = async (databaseName, collectionName, query) => {
  return mongodbConnect.db(databaseName).collection(collectionName)
    .countDocuments({
      ...query,
      ...softDeleteRetrieveCondition,
    });
};

const deleteMany = async (databaseName, collectionName, query, options) => {
  const resultDelete = await mongodbConnect.db(databaseName).collection(collectionName).deleteMany(query, options);
  return resultDelete.result;
};


exports.createConnection = createConnection;
exports.closeConnection = closeConnection;
exports.insert = insert;
exports.findAndModify = findAndModify;
exports.updateOne = updateOne;
exports.update = update;
exports.softDelete = softDelete;
exports.softDeleteMany = softDeleteMany;
exports.deleteDoc = deleteDoc;
exports.findOne = findOne;
exports.find = find;
exports.count = count;
exports.deleteMany = deleteMany;
exports.insertMany = insertMany;
