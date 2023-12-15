const express = require("express");
const ContactController = require("../controllers/ContactsController");
const { verifyToken } = require("../../../middleware/AuthMiddleware");
const { check, query } = require("express-validator");
const { ContactStatus } = require("../../../config/constants");

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
    check("name").not().isEmpty(),
    check("title").not().isEmpty(),
    check("accountName").not().isEmpty(),
    check("status").isIn(Object.values(ContactStatus)),
  ],
  verifyToken,
  ContactController.create
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
  ContactController.index
);

//Get by ID Method
router.get("/:id/show", verifyToken, ContactController.show);

//Update by ID Method
router.put(
  "/:id/update",
  [
    check("name").not().isEmpty(),
    check("title").not().isEmpty(),
    check("accountName").not().isEmpty(),
    check("status").isIn(Object.values(ContactStatus)),
  ],
  verifyToken,
  ContactController.update
);

//Delete by ID Method
router.delete("/:id/delete", verifyToken, ContactController.delete);

module.exports = router;
