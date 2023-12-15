const express = require("express");
const AccountController = require("../controllers/AccountsController");
const { verifyToken } = require("../../../middleware/AuthMiddleware");
const { check, query } = require("express-validator");
const { NewAccountStatus } = require("../../../config/constants");

const validateURLDomain = (fieldValue) => {
  return check(fieldValue)
    .optional()
    .custom((value) => {
      try {
        const url = new URL(value);
        const baseUrl = process.env.AWS_S3_BASEURL;
        if (`https://${url.hostname}` !== baseUrl) {
          throw new Error("Invalid domain");
        }
        return true;
      } catch (err) {
        throw new Error("Invalid URL");
      }
    });
};

const router = express.Router();

//Post Method
router.post(
  "/",
  [
    check("accountName").not().isEmpty(),
    check("phoneNumber").not().isEmpty(),
    check("accountOwnerAlias").not().isEmpty(),
    check("status").isIn(Object.values(NewAccountStatus)),
  ],
  verifyToken,
  AccountController.create
);

//Get all Method
router.get(
  "/",
  [
    query("page").optional().isNumeric(),
    query("limit").optional().isNumeric(),
    query("query").optional().isString(),
  ],
  verifyToken,
  AccountController.index
);

//Get by ID Method
router.get("/:id/show", verifyToken, AccountController.show);

//Update by ID Method
router.put(
  "/:id/update",
  [
    check("accountName").not().isEmpty(),
    check("phoneNumber").not().isEmpty(),
    check("accountOwnerAlias").not().isEmpty(),
    check("status").isIn(Object.values(NewAccountStatus)),
  ],
  verifyToken,
  AccountController.update
);

//Delete by ID Method
router.delete("/:id/delete", verifyToken, AccountController.delete);

module.exports = router;
