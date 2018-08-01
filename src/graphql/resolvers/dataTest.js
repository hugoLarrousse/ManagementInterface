const dataTest = require('../../dataTest/cron');

exports.manual = async () => {
  console.log('IN');
  dataTest.cronTask();
  return {
    inProgress: true,
  };
};
