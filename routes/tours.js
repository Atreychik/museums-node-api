const router = require("express").Router();

const Tour = require("../models/data/tour");
const { ADD, REMOVE } = require("../constant/actions");
const { VISITOR, GUIDE, ADMIN } = require("../constant/roles");
const { validate } = require("../middleware/validationManager");
const { upload, setDataFileField } = require("../middleware/uploadManager");
const { isAuthenticated, hasAccess } = require("../middleware/accessManager");
const { getUsersTours, updateVisitors } = require("../controllers/tour");
const {
  getAllData,
  getDataByField,
  createData,
  deleteDataById,
  updateData,
} = require("../controllers/common");

router.get("/", getAllData(Tour, ["guide", "visitors", "exhibits"]));
router.get("/usersTours", [isAuthenticated, getUsersTours]);
router.get(
  "/:id",
  getDataByField({
    model: Tour,
    field: "slug",
    populateWith: ["guide", "visitors", "exhibits"],
  })
);
router.post("/", [
  isAuthenticated,
  hasAccess([GUIDE, ADMIN]),
  upload.single("image"),
  setDataFileField("image"),
  validate("tour"),
  createData(Tour),
]);
router.delete("/:id", [
  isAuthenticated,
  hasAccess([GUIDE, ADMIN]),
  deleteDataById({
    model: Tour,
    checkIsOwner: true,
    identifyBy: "guide",
    checkIsAdmin: true,
  }),
]);
router.put("/:id", [
  isAuthenticated,
  hasAccess([GUIDE, ADMIN]),
  upload.single("image"),
  setDataFileField("image"),
  validate("tour"),
  updateData({
    model: Tour,
    checkIsOwner: true,
    identifyBy: "guide",
    checkIsAdmin: true,
  }),
]);
router.patch("/:id/addVisitor", [
  isAuthenticated,
  hasAccess([VISITOR]),
  updateVisitors({ action: ADD }),
]);
router.patch("/:id/removeVisitor", [
  isAuthenticated,
  hasAccess([VISITOR, GUIDE, ADMIN]),
  updateVisitors({ action: REMOVE }),
]);

module.exports = router;
