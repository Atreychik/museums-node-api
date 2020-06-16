const jwt = require("jsonwebtoken");

const createTokens = (data) => {
  const accessToken = jwt.sign(data, process.env.JWT_SECRET, {
    expiresIn: "150m",
  });

  const refreshToken = jwt.sign(data, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  const resetToken = jwt.sign(data, process.env.JWT_SECRET, {
    expiresIn: "5m",
  });

  return {
    accessToken,
    refreshToken,
    resetToken,
  };
};

const verifyToken = async (token) => {
  try {
    const data = await jwt.verify(token, process.env.JWT_SECRET);
    return [null, data];
  } catch (error) {
    return [error, {}];
  }
};

const getAccessToken = (req) => {
  const authorizationToken = req.get("Authorization");
  const accessToken = authorizationToken
    ? authorizationToken.split(" ")[1]
    : null;

  return accessToken;
};

module.exports = {
  createTokens,
  verifyToken,
  getAccessToken,
};
