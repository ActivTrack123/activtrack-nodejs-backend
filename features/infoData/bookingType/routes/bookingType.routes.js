const express = require("express");
const bookingTypeController = require("../controllers/bookingTypeController");
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
  bookingTypeController.create
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
  bookingTypeController.index
);

// Get by ID Method
router.get("/:id/show", verifyToken, bookingTypeController.show);

// Update by ID Method
router.put(
  "/:id/update",
  [
    check("name").not().isEmpty(),
    check("status").isIn(Object.values(CarrierStatus)),
  ],
  verifyToken,
  bookingTypeController.update
);

// Delete by ID Method
router.delete("/:id/delete", verifyToken, bookingTypeController.delete); // Updated controller reference

module.exports = router;
