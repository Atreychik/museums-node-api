const router = require("express").Router();

const Exhibit = require("../models/data/exhibit");
const { NewExhibit, UpdatedExhibit } = require("../models/validation/exhibit");
const { ADMIN } = require("../constant/roles");
const { validate } = require("../middleware/validationManager");
const { upload, setDataFileField } = require("../middleware/uploadManager");
const { isAuthenticated, hasAccess } = require("../middleware/accessManager");
const {
  getAllData,
  getDataByField,
  createData,
  deleteDataById,
  updateData,
} = require("../controllers/common");

router.get("/", getAllData({ model: Exhibit }));
router.get("/:id", getDataByField({ model: Exhibit, field: "slug" }));
router.post("/", [
  isAuthenticated,
  hasAccess([ADMIN]),
  upload.single("image"),
  setDataFileField("image"),
  validate({ schema: NewExhibit }),
  createData({ model: Exhibit }),
]);
router.delete("/:id", [
  isAuthenticated,
  hasAccess([ADMIN]),
  deleteDataById({ model: Exhibit }),
]);
router.put("/:id", [
  isAuthenticated,
  hasAccess([ADMIN]),
  upload.single("image"),
  setDataFileField("image"),
  validate({ schema: UpdatedExhibit }),
  updateData({ model: Exhibit }),
]);

module.exports = router;
