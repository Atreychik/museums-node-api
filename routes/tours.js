const router = require("express").Router();

const Tour = require("../models/data/tour");
const { NewTour, UpdatedTour } = require("../models/validation/tour");
const { ADD, REMOVE } = require("../constant/actions");
const { VISITOR, GUIDE, ADMIN } = require("../constant/roles");
const { validate } = require("../middleware/validationManager");
const { parseArrays } = require("../middleware/requestManager");
const { upload, setDataFileField } = require("../middleware/uploadManager");
const {
  isAuthenticated,
  hasAccess,
  isOwner,
} = require("../middleware/accessManager");
const { getUsersTours, updateVisitors } = require("../controllers/tour");
const {
  getAllData,
  getDataByField,
  createData,
  deleteDataById,
  updateData,
} = require("../controllers/common");

router.get(
  "/",
  getAllData({ model: Tour, populateWith: ["guide", "visitors", "exhibits"] })
);
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
  parseArrays({ arraysFields: ["exhibits", "visitors"] }),
  validate({ schema: NewTour }),
  createData({ model: Tour }),
]);
router.delete("/:id", [
  isAuthenticated,
  hasAccess([GUIDE, ADMIN]),
  isOwner({ model: Tour, identifyBy: "guide" }),
  deleteDataById({ model: Tour }),
]);
router.put("/:id", [
  isAuthenticated,
  hasAccess([GUIDE, ADMIN]),
  isOwner({ model: Tour, identifyBy: "guide" }),
  upload.single("image"),
  setDataFileField("image"),
  parseArrays({ arraysFields: ["exhibits", "visitors"] }),
  validate({ schema: UpdatedTour }),
  updateData({ model: Tour }),
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
