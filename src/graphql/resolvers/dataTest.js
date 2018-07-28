const dataTest = require('../../dataTest/cron');

exports.manual = async () => {
  dataTest.cronTask();
  return {
    inProgress: true,
  };
};
