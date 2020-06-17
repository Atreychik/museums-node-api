const to = require("await-to-js").default;

const validate = ({ schema }) => async ({ method, body }, res, next) => {
  if (method != "POST" && method != "PUT") return next();

  const [error] = await to(
    schema.validateAsync(body, {
      abortEarly: false,
    })
  );
  if (error) return res.status(400).json(error);

  return next();
};

module.exports = {
  validate,
};
