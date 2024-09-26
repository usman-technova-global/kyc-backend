const bcrypt = require('bcryptjs');

const saltRounds = 10;

const hashAsync = async (password) => bcrypt.hashSync(password, saltRounds);

const isVerifyAsync = async (password, hash) =>
  bcrypt.compareSync(password, hash);

module.exports = { hashAsync, isVerifyAsync };
