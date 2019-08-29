const User = require('../user');

// Maybe<User>
const extractUserFromToken = async (req) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return null;
  }

  const matchToken = authorization.match(/^Bearer (.*)$/);
  if (!(matchToken && matchToken[1])) {
    return null;
  }

  const user = await User.findAndVerifyByAuthToken(matchToken[1]);
  return user;
}

const get = async (req, res) => {
  const user = await extractUserFromToken(req);
  if (!user) {
    return res.status(400).end();
  }
  res.status(200).json(user.data);
}

const patch = async (req, res) => {
  const user = await extractUserFromToken(req);
  if (!user) {
    return res.status(400).end();
  }
  await user.update({ data: req.body });
  res.status(200).json(user.data);
}

module.exports = { get, patch };
