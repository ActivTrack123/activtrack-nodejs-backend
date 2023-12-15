const multer = require('multer');
const path = require("path");

let storage = multer.memoryStorage({
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + '.' + path.extname(file.originalname));
  }
});

const upload = multer({
  storage : storage,
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
  fileFilter: function(req, file, cb) {
    // any type of file is supported
    cb(null, true);
  },
});

module.exports = upload;