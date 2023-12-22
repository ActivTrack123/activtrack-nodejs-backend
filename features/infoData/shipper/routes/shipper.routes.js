const express = require("express");
const shipperController = require("../controllers/shipperController");
const { verifyToken } = require("../../../../middleware/AuthMiddleware");
const { check, query } = require("express-validator");
const { CarrierStatus } = require("../../../../config/constants");

const validateURLDomain = (fieldValue) => {
  return check(fieldValue)
    .optional()
    .custom((value) => {
      // Your URL validation logic here
      // ...
      return true;
    });
};

const router = express.Router();

// Post Method
router.post(
  "/",
  [
    check("name").not().isEmpty(),
    check("status").isIn(Object.values(CarrierStatus)),
  ],
  verifyToken,
  shipperController.create
);

// Get all Method
router.get(
  "/",
  [
    query("page").optional().isNumeric(),
    query("limit").optional().isNumeric(),
    query("query").optional().isString(),
  ],
  verifyToken,
  shipperController.index
);

// Get by ID Method
router.get("/:id/show", verifyToken, shipperController.show);

// Update by ID Method
router.put(
  "/:id/update",
  [
    check("name").not().isEmpty(),

    check("status").isIn(Object.values(CarrierStatus)),
  ],
  verifyToken,
  shipperController.update
);

// Delete by ID Method
router.delete("/:id/delete", verifyToken, shipperController.delete);

module.exports = router;
