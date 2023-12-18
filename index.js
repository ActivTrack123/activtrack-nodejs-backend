const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const mongoose = require("mongoose");

// Import Routes
const authRoutes = require("./auth/routes/auth.routes");
const userRoutes = require("./features/users/routes/user.routes");
const accountRoutes = require("./features/accounts/routes/accounts.routes");
const customerRoutes = require("./features/customers/routes/customer.routes");
const contactRoutes = require("./features/contacts/routes/contacts.routes");
const vesselRoutes = require("./features/portData/routes/Vessel.routes")
require("dotenv").config();
require("dotenv").config({ path: path.join(__dirname, ".env") });

const app = express();

const option = {
  socketTimeoutMS: 30000,
};

const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI, option).then(
  function () {
    //connected successfully
    console.log("Mongo DB connected!");
  },
  function (err) {
    //err handle
    console.log("Failed to connect with Mongo DB", mongoURI);
  }
);

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (request, response, next) {
  response.setHeader("Cache-Control", "no-cache, no-store");
  next();
});

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to application." });
});

app.use("/api/v1/auth/", authRoutes);
app.use("/api/v1/user/", userRoutes);
app.use("/api/v1/account/", accountRoutes);
app.use("/api/v1/customer/", customerRoutes);
app.use("/api/v1/contact/", contactRoutes);
app.use("/api/v1/vessel/", vesselRoutes);
// set port, listen for requests
const APP_PORT = process.env.APP_PORT;
app.use(require("express-status-monitor")());
app.disable("x-powered-by");

app.listen(APP_PORT, () => {
  console.log(`Server is running on port ${APP_PORT}.`);
});

module.exports = app;
