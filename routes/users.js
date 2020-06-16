const router = require("express").Router();

const User = require("../models/data/user");
const { VISITOR, GUIDE, ADMIN } = require("../constant/roles");
const { validate } = require("../middleware/validationManager");
const { isAuthenticated, hasAccess } = require("../middleware/accessManager");
const { aproveUser, updateRole } = require("../controllers/user");
const {
  getAllData,
  getDataByField,
  deleteDataById,
  updateData,
} = require("../controllers/common");

router.use(validate("user"));

router.get(
  "/",
  // isAuthenticated,
  // hasAccess([VISITOR, GUIDE, ADMIN]),
  getAllData(User, ["role"])
);
router.get(
  "/:id",
  getDataByField({ model: User, field: "username", populateWith: ["role"] })
);
router.delete("/:id", [
  isAuthenticated,
  // hasAccess([VISITOR, GUIDE, ADMIN]),
  deleteDataById({ model: User, checkIsOwner: true, identifyBy: "_id" }),
]);
router.put("/:id", [
  isAuthenticated,
  // hasAccess([VISITOR, GUIDE, ADMIN]),
  updateData({
    model: User,
    checkIsOwner: true,
    identifyBy: "_id",
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
