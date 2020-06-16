const to = require("await-to-js").default;
const bcrypt = require("bcrypt");

const hashPassword = async (req, res, next) => {
  const [error, hashedPassword] = await to(bcrypt.hash(req.body.password, 12));

  if (error) return next(new Error("Error at hashing password"));

  req.body.password = hashedPassword;
  return next();
};

module.exports = {
  hashPassword,
};
