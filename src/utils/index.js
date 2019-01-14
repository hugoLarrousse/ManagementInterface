const winston = require('winston');


const env = process.env.NODE_ENV || 'development';
const loggerEnabledStatus = process.env.LOGGER || 'all';
// const logDirectory = './logs';

// Create the logger directory if it does not exist
// if (!fs.existsSync(logDirectory)) {
//   fs.mkdirSync(logDirectory);
// }

const transports = [
  // colorize the output to the console
  new (winston.transports.Console)({
    colorize: true,
    level: 'info',
    json: true,
  }),
];

const customLogger = winston.createLogger({
  transports,
});

if (env === 'test' || loggerEnabledStatus === 'none') {
  customLogger.remove(winston.transports.Console);
}

const createLabel =
  (filename, methodName, database, collection, message, _id) => {
    return `\`\`\`\nfilename: ${filename}\nmethodName: ${methodName}\ndatabase: ${database}
collection: ${collection}\nmessage: ${message}\n_id: ${_id}\`\`\``;
  };

const createLabelOther =
  (filename, methodName, message, _id) => {
    if (!_id) {
      return `\`\`\`
  filename: ${filename}
  methodName: ${methodName}
  message: ${message}
\`\`\``;
    }
    return `\`\`\`
  filename: ${filename}
  methodName: ${methodName}
  message: ${message}
  _id: ${_id}
\`\`\``;
  };

const error = async (filename, methodName, message, rest) => {
  customLogger.error(createLabelOther(filename, methodName, message, null), rest);
};

const errorDb = async (filename, methodName, database, collection, message, _id, rest) => {
  customLogger.error(createLabel(filename, methodName, database, collection, message, _id), rest);
};

const info = (filename, methodName, message, _id, ...rest) => {
  customLogger.info(createLabelOther(filename, methodName, message, _id), ...rest);
};

const warn = (filename, methodName, message, _id, ...rest) => {
  customLogger.warn(createLabelOther(filename, methodName, message, _id), ...rest);
};

const warnDb = async (filename, methodName, database, collection, message, _id, rest) => {
  customLogger.warn(createLabel(filename, methodName, database, collection, message, _id), rest);
};

const create = (e) => {
  console.log(`${new Date()} - ${e}`);
};

exports.error = error;
exports.create = create;
exports.info = info;
exports.warn = warn;
exports.errorDb = errorDb;
exports.warnDb = warnDb;
