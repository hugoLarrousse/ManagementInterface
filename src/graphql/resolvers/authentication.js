const { authenticateUser } = require('../authentication');

exports.jwtLogin = async ({ email, password }) => {
  try {
    return await authenticateUser(email, password);
  } catch (e) {
    throw new Error(e.message);
  }
};
