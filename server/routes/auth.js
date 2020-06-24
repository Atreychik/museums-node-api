const router = require("express").Router();

const {
  login,
  logout,
  signup,
  refreshTokens,
  forgetPassword,
  resetPassword,
} = require("../controllers/auth");
const { NewUser } = require("../models/validation/user");
const { isAuthenticated } = require("../middleware/accessManager");
const { hashPassword } = require("../middleware/passwordManager");
const { validate } = require("../middleware/validationManager");

router.get("/logout", [isAuthenticated, logout]);
router.post("/login", login);
router.post("/signup", [validate({ schema: NewUser }), hashPassword, signup]);
router.post("/refreshtoken", refreshTokens);
router.post("/forgetpassword", forgetPassword);
router.post("/resetpassword", [hashPassword, resetPassword]);

module.exports = router;
