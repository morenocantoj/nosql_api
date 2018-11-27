const jwt = require('jwt-simple');
const moment = require('moment');
require('dotenv').load();
const secret = process.env.JWT_SECRET

module.exports = {

  /**
  * Creates an user token created from username
  * @param user User object
  */
  createToken: function(user) {
    // Token valid for 7 days
    var payload = {
        username: user.username,
        exp: moment().add(7, 'days').valueOf()
    }

    return jwt.encode(payload, secret);
  },

  checkToken: async function(token) {
    try {
      let decoded = jwt.decode(token, secret);
      return true

    } catch (error) {
      // Token not valid or can not decode it
      return false
    }
  }
}
