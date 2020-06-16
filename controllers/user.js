const to = require("await-to-js").default;

const User = require("../models/data/user");

const aproveUser = async (req, res, next) => {
  const { id } = req.params;

  const [error, data] = await to(
    User.findByIdAndUpdate(id, { isAproved: true }, { new: true })
  );

  if (error) return res.status(404).send();

  res.status(200).json(data);
};

const updateRole = async (req, res, next) => {
  const { id } = req.params;
  const { role } = req.body;

  const [error, data] = await to(
    User.findByIdAndUpdate(id, { role }, { new: true })
  );

  if (error) return res.status(404).send();

  res.status(200).json(data);
};

module.exports = {
  aproveUser,
  updateRole,
};
