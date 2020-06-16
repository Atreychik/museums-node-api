const router = require("express").Router();

const {
  login,
  logout,
  signup,
  refreshTokens,
  forgetPassword,
  resetPassword,
} = require("../controllers/auth");
const { isAuthenticated } = require("../middleware/accessManager");
const { hashPassword } = require("../middleware/passwordManager");
const { validate } = require("../middleware/validationManager");

router.post("/login", login);
router.get("/logout", [isAuthenticated, logout]);
router.post("/signup", [hashPassword, validate("user"), signup]);
router.post("/refreshtoken", [isAuthenticated, refreshTokens]);
router.post("/forgetpassword", forgetPassword);
router.post("/resetpassword", [hashPassword, resetPassword]);

module.exports = router;
