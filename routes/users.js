const router = require("express").Router();

const User = require("../models/data/user");
const { UpdatedUser } = require("../models/validation/user");
const { ADMIN } = require("../constant/roles");
const { validate } = require("../middleware/validationManager");
const { hashPassword } = require("../middleware/passwordManager");
const {
  isAuthenticated,
  hasAccess,
  isOwner,
} = require("../middleware/accessManager");
const {
  getAllData,
  getDataByField,
  deleteDataById,
  updateData,
} = require("../controllers/common");
const { aproveUser, updateRole } = require("../controllers/user");

router.get(
  "/",
  // isAuthenticated,
  // hasAccess([ADMIN]),
  getAllData({ model: User, populateWith: ["role"] })
);
router.get(
  "/:id",
  isAuthenticated,
  isOwner({ model: User, findBy: "username" }),
  getDataByField({ model: User, field: "username", populateWith: ["role"] })
);
router.delete("/:id", [
  isAuthenticated,
  isOwner({ model: User }),
  deleteDataById({ model: User }),
]);
router.put("/:id", [
  isAuthenticated,
  isOwner({ model: User }),
  validate({ schema: UpdatedUser }),
  hashPassword,
  updateData({
    model: User,
    ignoreFields: ["isAproved", "role", "email", "username"],
  }),
]);
router.patch("/:id/aprove", [isAuthenticated, hasAccess([ADMIN]), aproveUser]);
router.patch("/:id/updateRole", [
  isAuthenticated,
  hasAccess([ADMIN]),
  updateRole,
]);

module.exports = router;
