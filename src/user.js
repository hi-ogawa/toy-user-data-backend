const { Sequelize, Model } = require('sequelize');
const { sequelize } = require('./db');
const bcrypt = require('bcryptjs');
const jws = require('jws');

const jws_alg = 'HS256';
const bcrypt_rounds = 10;

class User extends Model {
  // Maybe<User>
  static async register(username, password) {
    const encrypted_password = await bcrypt.hash(password, bcrypt_rounds);
    try {
      const user = await User.create({ username, encrypted_password });
      return user;
    } catch (err) {
      return null;
    }
  }
  // Maybe<User>
  static async findAndVerifyByLoginData(username, password) {
    const user = await User.findOne({ where: { username } });
    if (user) {
      const match = await bcrypt.compare(password, user.encrypted_password);
      return match ? user : null;
    }
    return null;
  }
  // Maybe<User>
  static async findAndVerifyByAuthToken(token) {
    let verified = false;
    try { verified = jws.verify(token, jws_alg, process.env.JWS_SECRET) } catch {}
    if (verified) {
      const { header: { alg }, payload } = jws.decode(token);
      let username;
      try { username = JSON.parse(payload).username } catch {}
      if (alg === jws_alg && username) {
        const user = await User.findOne({ where: { username } });
        return user;
      }
    }
    return null;
  }
  // string
  generateAuthToken() {
    return jws.sign({
      header: { alg: jws_alg },
      payload: { username: this.username },
      secret: process.env.JWS_SECRET,
    })
  }
}

User.init({
  username: {
    type: Sequelize.STRING, allowNull: false
  },
  encrypted_password: {
    type: Sequelize.STRING, allowNull: false
  },
  data: {
    type: Sequelize.JSON
  },
}, {
  indexes: [ { unique: true, fields: ['username'] } ],
  sequelize
})

module.exports = User;
