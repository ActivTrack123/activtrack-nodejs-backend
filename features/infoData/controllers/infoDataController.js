const carrierModel = require("../carriers/models/carrierModel");
const consigneeModel = require("../consignee/models/consigneeModel");
const shipperModel = require("../shipper/models/shipperModel");
const merchandiserModel = require("../merchandiser/models/merchandiserModel");
const originModel = require("../origin/models/originModel");
const bookingTypeModel = require("../bookingType/models/bookingTypeModel");
const incotermModel = require("../incoterms/models/incotermsModel");
const serviceModel = require("../services/models/servicesModel");

const infoDataController = {
  async index(request, response, next) {
    try {
      const getModelNames = async (model) => {
        return (await model.find({}, { name: 1, _id: 0 })).map(
          (item) => item.name
        );
      };

      const carriers = await getModelNames(carrierModel);
      const consignees = await getModelNames(consigneeModel);
      const shippers = await getModelNames(shipperModel);
      const merchandisers = await getModelNames(merchandiserModel);
      const origins = await getModelNames(originModel);
      const bookingTypes = await getModelNames(bookingTypeModel);
      const incoterms = await getModelNames(incotermModel);
      const services = await getModelNames(serviceModel);

      return response.status(200).json({
        carriers,
        consignees,
        shippers,
        merchandisers,
        origins,
        bookingTypes,
        incoterms,
        services,
      });
    } catch (error) {
      return response.status(500).json({ message: error.message });
    }
  },
};

module.exports = infoDataController;
