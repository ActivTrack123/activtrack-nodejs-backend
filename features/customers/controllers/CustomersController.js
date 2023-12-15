const Customer = require("../models/CustomerModel");
const CustomerService = require("../services/CustomerServices");
const { validationResult } = require("express-validator");
const { default: mongoose } = require("mongoose");

const CustomerController = {
  async index(request, response, next) {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: "Validation errors",
        data: errors,
      });
    }

    try {
      const {
        page = 1,
        limit = 10,
        query: name,
        status,
        sortBy,
      } = request.query;

      const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

      const query = {};
      if (name) {
        const nameRegex = { $regex: new RegExp(name), $options: "i" };
        query.$or = [
          { name: nameRegex },
          { email: nameRegex },
          { phone: nameRegex },
          { country: nameRegex },
        ];
      }

      if (status) {
        const statusArr = status.split(",");
        query.status = { $in: statusArr };
      }

      const sort = {};

      // Define the allowed sortBy values
      const allowedSortValues = [
        "name",
        "email",
        "phone",
        "age",
        "country",
        "zipCode",
        "web",
        "description",
        "accountStatus",
      ];

      if (allowedSortValues.includes(sortBy)) {
        sort[sortBy] = 1; //Can change the sort direction (1 for ascending, -1 for descending)
      } else {
        // Default sorting if sortBy is not provided or is not an allowed value
        sort.created = -1;
      }

      const customers = await Customer.find(query)
        .sort(sort)
        .limit(parseInt(limit, 10))
        .skip(skip)
        .sort({ created: -1 });
      const total = await Customer.countDocuments(query);

      return response.status(200).json({
        error: false,
        message: "Customer list retrieved!",
        data: {
          customers,
          total,
          limit: customers.length,
          page: parseInt(page, 10),
        },
      });
    } catch (error) {
      console.log(error);
      return response.status(400).json({
        error: true,
        message: "Failed to fetch customer list!",
        data: null,
      });
    }
  },

  async show(request, response, next) {
    try {
      const customer = await Customer.findById(request.params.id);

      return response.status(200).json({
        error: false,
        message: "Customer retrieved!",
        data: customer,
      });
    } catch (error) {
      return response.status(400).json({
        error: true,
        message: "Failed to fetch customer!",
        data: null,
      });
    }
  },

  async create(request, response, next) {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: "Validation errors",
        data: errors,
      });
    }

    const payload = request.body;

    try {
      const newCustomer = await CustomerService.createCustomer(
        payload,
        request
      );
      if (!newCustomer.error) {
        return response.status(200).json({
          error: false,
          message: "Customer created!",
          data: {},
        });
      } else {
        return response.status(400).json({
          error: true,
          message: "Failed to create customer!",
          data: null,
        });
      }
    } catch (error) {
      console.log(error);
      return response.status(400).json({
        error: true,
        message: "Failed to create customer!",
        data: null,
      });
    }
  },

  async update(request, response, next) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: "Validation errors",
        data: errors,
      });
    }

    const payload = request.body;

    try {
      const customer = await CustomerService.updateCustomer(payload, request);
      if (!customer.error && customer != null) {
        return response.status(200).json({
          error: false,
          message: "Customer updated!",
          data: {},
        });
      } else {
        return response.status(400).json({
          error: true,
          message: "Failed to update customer!",
          data: null,
        });
      }
    } catch (error) {
      return response.status(400).json({
        error: true,
        message: "Failed to update customer!",
        data: null,
      });
    }
  },

  async delete(request, response, next) {
    try {
      const customer = await Customer.findByIdAndDelete(request.params.id);
      if (customer != null) {
        return response.status(200).json({
          error: false,
          message: "Customer deleted!",
          data: {},
        });
      } else {
        return response.status(200).json({
          error: false,
          message: "Can not find customer!",
          data: null,
        });
      }
    } catch (error) {
      return response.status(400).json({
        error: true,
        message: "Failed to delete customer!",
        data: null,
      });
    }
  },
};

module.exports = CustomerController;
