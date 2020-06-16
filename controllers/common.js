const to = require("await-to-js").default;

const { ADMIN } = require("../constant/roles");

const getAllData = (model, populateWith = []) => async (req, res, next) => {
  const path = populateWith.join(" ");
  const [error, data] = await to(model.find().populate(path));

  if (error) return next(new Error(`Error at fetching ${model.modelName}`));
  if (!data.length) return res.status(404).send();

  res.status(200).json(data);
};

const getDataByField = ({ model, field, populateWith = [] }) => async (
  req,
  res,
  next
) => {
  const { id } = req.params;
  const path = populateWith.join(" ");
  const [error, data] = await to(model.findOne({ [field]: id }).populate(path));

  if (error || !data) return res.status(404).send();

  res.status(200).json(data);
};

const createData = (model) => async (req, res, next) => {
  const [error, data] = await to(model.create({ ...req.body }));

  if (error) return next(new Error(`Error at creating new ${model.modelName}`));

  res.status(201).json(data);
};

const deleteDataById = ({
  model,
  checkIsOwner = false,
  identifyBy,
  checkIsAdmin = false,
}) => async (req, res, next) => {
  const { userId, userRole } = res.locals;
  const { id } = req.params;

  const notIsAdmin = checkIsAdmin && userRole != ADMIN;
  const notIsOwner = checkIsOwner && userId != data[identifyBy];

  if (notIsAdmin || (notIsOwner && !checkIsAdmin))
    return res.status(403).json({ message: "You don't have a permissions!" });

  const [error, data] = await to(model.findById(id));
  if (error || !data) return res.status(404).send();

  data.remove();
  res.status(200).json(data);
};

const updateData = ({
  model,
  checkIsOwner = false,
  identifyBy,
  checkIsAdmin = false,
}) => async (req, res, next) => {
  const { userId, userRole } = res.locals;
  const { id } = req.params;

  const notIsAdmin = checkIsAdmin && userRole != ADMIN;
  const notIsOwner = checkIsOwner && userId != data[identifyBy];

  if (notIsAdmin || (notIsOwner && !checkIsAdmin))
    return res.status(403).json({ message: "You don't have a permissions!" });

  const [error, data] = await to(
    model.findByIdAndUpdate(id, { ...req.body }, { new: true })
  );

  if (error) return res.status(404).send();

  res.status(200).json(data);
};

module.exports = {
  getAllData,
  getDataByField,
  createData,
  deleteDataById,
  updateData,
};
