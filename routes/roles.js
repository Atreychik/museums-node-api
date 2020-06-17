const router = require("express").Router();

const Role = require("../models/data/role");
const { getAllData } = require("../controllers/common");

router.get("/", getAllData({ model: Role }));

module.exports = router;
