const to = require("await-to-js").default;
const bcrypt = require("bcrypt");

const User = require("../models/data/user");
const RefreshToken = require("../models/data/refreshToken");
const { sendMail } = require("../utils/emailManager");
const { createTokens, verifyToken } = require("../utils/tokensManager");

const login = async (req, res, next) => {
  const { login, password } = req.body;
  const [error, user] = await to(
    User.findOne({ $or: [{ username: login }, { email: login }] }).populate(
      "role"
    )
  );

  if (error || !user)
    return res.status(401).json({ message: `User "${login}" isn't exist` });

  const [compareError, isMatch] = await to(
    bcrypt.compare(password, user.password)
  );

  if (compareError) return next(new Error("Error at comparing passwords"));
  if (!isMatch) return res.status(401).json({ message: "Wrong password" });

  const { accessToken, refreshToken } = createTokens({
    id: user.id,
    role: user.role.role,
    isAproved: user.isAproved,
  });

  const [pushTokenError] = await to(
    RefreshToken.findOneAndUpdate(
      { user: user.id },
      { $push: { refreshTokens: refreshToken } },
      { upsert: true, new: true }
    )
  );
  if (pushTokenError) return next(new Error("Error at pushing refresh token"));

  res.status(200).json({
    accessToken,
    refreshToken,
  });
};

const logout = async (req, res, next) => {
  const { userId } = res.locals;

  const [error] = await to(
    RefreshToken.findOneAndUpdate({ user: userId }, { refreshTokens: [] })
  );
  if (error) return next(new Error("Error in logout"));

  res.status(200).send();
};

const signup = async (req, res, next) => {
  const { email, username } = req.body;
  const [fetchingError, existingUser] = await to(
    User.findOne({ $or: [{ email }, { username }] })
  );

  if (fetchingError) return next(new Error("Error at fetching user"));
  if (existingUser)
    return res
      .status(401)
      .json({ message: `User with this email/username already exist` });

  const [error] = await to(User.create({ ...req.body }));
  if (error) return next(new Error(`Error at creating new user`));

  res.status(201).json({ message: "Successfully signed up" });
};

const refreshTokens = async (req, res, next) => {
  const { refreshToken: token } = req.body;
  const { userId } = res.locals;

  const [verificationError, { id, role, isAproved }] = await verifyToken(token);
  if (verificationError) return res.status(401).send();

  const [error, acceptableToken] = await to(
    RefreshToken.findOne({ user: userId, refreshTokens: { $in: [token] } })
  );
  if (error)
    return next(new Error("Error at finding acceptable refresh token"));
  if (!acceptableToken)
    return res.status(401).json({ message: "Refresh token isn't acceptable!" });

  const { accessToken, refreshToken } = createTokens({ id, role, isAproved });

  res.status(200).json({ refreshToken, accessToken });
};

const forgetPassword = async (req, res, next) => {
  const { email } = req.body;
  const { resetToken } = createTokens({ email });

  const [error, info] = await sendMail({ email, resetToken });
  if (error) return next(new Error("Error at sending message"));

  res
    .status(200)
    .json({ message: `Email for password reset was sent to ${email}` });
};

const resetPassword = async (req, res, next) => {
  const { resetToken, password } = req.body;

  const [verificationError, { email }] = await verifyToken(resetToken);
  if (verificationError)
    return res
      .status(401)
      .json({ message: "Link already expired, use new one" });

  const [error] = await to(User.findOneAndUpdate({ email }, { password }));
  if (error) return next(new Error("Error at reseting password"));

  res.status(200).json({ message: "Password was successfully changed" });
};

module.exports = {
  login,
  logout,
  signup,
  refreshTokens,
  forgetPassword,
  resetPassword,
};
