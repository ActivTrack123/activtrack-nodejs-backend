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

const vesselRoutes = require("./features/portData/routes/Vessel.routes");
const airlineRoutes = require("./features/portData/routes/Airline.routes");
const airportRoutes = require("./features/portData/routes/Airport.routes");
const consigneeRoutes = require("./features/infoData/consignee/routes/consignee.routes");
const carrierRoutes = require("./features/infoData/carriers/routes/carrier.routes");
const shipperRoutes = require("./features/infoData/shipper/routes/shipper.routes");
const merchandiserRoutes = require("./features/infoData/merchandiser/routes/merchandiser.routes");
const originRoutes = require("./features/infoData/origin/routes/origin.routes");
const bookingTypeRoutes = require("./features/infoData/bookingType/routes/bookingType.routes");
const incotermRoutes = require("./features/infoData/incoterms/routes/incoterms.routes");
const serviceRoutes = require("./features/infoData/services/routes/services.routes");
const infoDataRoutes = require("./features/infoData/routes/infoData.routes");


const transhipmentHubRoutes =require("./features/portData/routes/TranshipmentHub.routes")
const portDataLoadingRoutes =require("./features/portData/routes/PortDataLoading.routes")
const portDataDischargeRoutes =require("./features/portData/routes/PortDataDischarge.routes")
const portDataReceiptRoutes =require("./features/portData/routes/PortDataReceipt.routes")
const dsrRoutes=require("./features/dsr/routes/Dsr.routes")
const vesselScheduleRoutes= require("./features/vesselSchedule/routes/VesselSchedule.routes")
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
app.use("/api/v1/airline/", airlineRoutes);
app.use("/api/v1/airport/", airportRoutes);

app.use("/api/v1/consignee/", consigneeRoutes);
app.use("/api/v1/carrier/", carrierRoutes);
app.use("/api/v1/shipper/", shipperRoutes);
app.use("/api/v1/merchandiser/", merchandiserRoutes);
app.use("/api/v1/origin/", originRoutes);
app.use("/api/v1/bookingType/", bookingTypeRoutes);
app.use("/api/v1/incoterm/", incotermRoutes);
app.use("/api/v1/service/", serviceRoutes);
app.use("/api/v1/info-data/", infoDataRoutes);

app.use("/api/v1/transhipmentHub/", transhipmentHubRoutes);
app.use("/api/v1/portDataLoading/", portDataLoadingRoutes);
app.use("/api/v1/portDataDischarge/", portDataDischargeRoutes);
app.use("/api/v1/portDataReceipt/", portDataReceiptRoutes);
app.use("/api/v1/vesselschedule/", vesselScheduleRoutes);
app.use("/api/v1/dsr/", dsrRoutes);
// set port, listen for requests
const APP_PORT = process.env.APP_PORT;
app.use(require("express-status-monitor")());
app.disable("x-powered-by");

app.listen(APP_PORT, () => {
  console.log(`Server is running on port ${APP_PORT}.`);
});

module.exports = app;
