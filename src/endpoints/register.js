const User = require('../user');

module.exports = async (req, res) => {
  const { username, password } = req.body;

  if (!(username && password)) {
    return res.status(400).end();
  }

  const user = await User.register(username, password);
  if (!user) {
    return res.status(400).end();
  }

  const authToken = user.generateAuthToken();
  res.status(200).json({
    username: user.username,
    authToken
  });
}
