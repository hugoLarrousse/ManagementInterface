const request = require('../../Utils/request');
const config = require('config');


const { fixedToken } = process.env;

module.exports = (id, crm, email) => {
  console.log('email SYNC', email);
  try {
    const data = {
      forSync: true,
      id: String(id),
      name: crm,
    };
    request(
      config.get('coreUrl'), `${crm}/syncAuto`, null, 'POST',
      { Authorization: fixedToken, 'Content-Type': 'application/x-www-form-urlencoded' }, data, null, true,
    );
  } catch (e) {
    console.log(`error: ${e.message}, user: ${id}`);
  }
};
