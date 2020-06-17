const to = require("await-to-js").default;

const { ADMIN } = require("../constant/roles");

const getAllData = ({ model, populateWith = [] }) => async (req, res, next) => {
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

const createData = ({ model }) => async (req, res, next) => {
  const [error, data] = await to(model.create({ ...req.body }));

  if (error) return next(new Error(`Error at creating new ${model.modelName}`));

  res.status(201).json(data);
};

const deleteDataById = ({ model }) => async (req, res, next) => {
  const { id } = req.params;

  const [error, data] = await to(model.findByIdAndRemove(id));
  if (error || !data) return res.status(404).send();

  res.status(200).json(data);
};

const updateData = ({ model, ignoreFields = [] }) => async (req, res, next) => {
  const { id } = req.params;

  const newData = Object.keys(req.body)
    .filter((key) => !ignoreFields.includes(key))
    .reduce(
      (obj, currentField) => ({
        ...obj,
        [currentField]: req.body[currentField],
      }),
      {}
    );

  const [error, updatedData] = await to(
    model.findByIdAndUpdate(id, newData, { new: true })
  );

  if (error) return res.status(404).send();

  res.status(200).json(updatedData);
};

module.exports = {
  getAllData,
  getDataByField,
  createData,
  deleteDataById,
  updateData,
};
