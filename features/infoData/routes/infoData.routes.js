const express = require("express");
const { verifyToken } = require("../../../middleware/AuthMiddleware");
const { check, query } = require("express-validator");
const infoDataController = require("../controllers/infoDataController");

const router = express.Router();

// Get all Method
router.get("/", [], verifyToken, infoDataController.index);

module.exports = router;
