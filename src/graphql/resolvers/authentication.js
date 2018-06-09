const { authenticateUser } = require('../authentification');

exports.jwtLogin = async ({ email, password }) => {
  try {
    return await authenticateUser(email, password);
  } catch (e) {
    throw new Error(e.message);
  }
};
