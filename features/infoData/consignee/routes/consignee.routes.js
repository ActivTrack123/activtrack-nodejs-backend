const express = require("express");
const consigneeController = require("../controllers/consigneeController");
const { verifyToken } = require("../../../../middleware/AuthMiddleware");
const { check, query } = require("express-validator");
const { ConsigneeStatus } = require("../../../../config/constants");

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
    check("status").isIn(Object.values(ConsigneeStatus)),
  ],
  verifyToken,
  consigneeController.create
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
  consigneeController.index
);

// Get by ID Method
router.get("/:id/show", verifyToken, consigneeController.show);

// Update by ID Method
router.put(
  "/:id/update",
  [
    check("name").not().isEmpty(),

    check("status").isIn(Object.values(ConsigneeStatus)),
  ],
  verifyToken,
  consigneeController.update
);

// Delete by ID Method
router.delete("/:id/delete", verifyToken, consigneeController.delete);

module.exports = router;
