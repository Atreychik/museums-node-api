const parseArrays = ({ arraysFields = [] }) => (req, res, next) => {
  arraysFields.map(
    (arrayField) => (req.body[arrayField] = JSON.parse(req.body[arrayField]))
  );

  return next();
};

module.exports = {
  parseArrays,
};
