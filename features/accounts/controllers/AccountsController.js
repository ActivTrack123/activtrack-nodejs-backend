const Account = require("../models/AccountModel");
const AccountService = require("../services/AccountServices");
const { validationResult } = require("express-validator");
const { default: mongoose } = require("mongoose");

const AccountController = {
  async index(request, response, next) {
    console.log(request);
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
        "accountName",
        "phoneNumber",
        "accountOwnerAlias",
        "status",
      ];

      if (allowedSortValues.includes(sortBy)) {
        sort[sortBy] = 1; //Can change the sort direction (1 for ascending, -1 for descending)
      } else {
        // Default sorting if sortBy is not provided or is not an allowed value
        sort.created = -1;
      }

      const accounts = await Account.find(query)
        .sort(sort)
        .limit(parseInt(limit, 10))
        .skip(skip)
        .sort({ created: -1 });
      const total = await Account.countDocuments(query);

      return response.status(200).json({
        error: false,
        message: "Account list retrieved!",
        data: {
          accounts,
          total,
          limit: accounts.length,
          page: parseInt(page, 10),
        },
      });
    } catch (error) {
      console.log(error);
      return response.status(400).json({
        error: true,
        message: "Failed to fetch account list!",
        data: null,
      });
    }
  },

  async show(request, response, next) {
    try {
      const account = await Account.findById(request.params.id);

      return response.status(200).json({
        error: false,
        message: "Account retrieved!",
        data: account,
      });
    } catch (error) {
      return response.status(400).json({
        error: true,
        message: "Failed to fetch account!",
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
      const newAccount = await AccountService.createAccount(payload, request);
      if (!newAccount.error) {
        return response.status(200).json({
          error: false,
          message: "Account created!",
          data: newAccount,
        });
      } else {
        return response.status(400).json({
          error: true,
          message: "Failed to create account!",
          data: null,
        });
      }
    } catch (error) {
      console.log(error);
      return response.status(400).json({
        error: true,
        message: "Failed to create account!",
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
      const account = await AccountService.updateAccount(payload, request);
      if (!account.error && account != null) {
        return response.status(200).json({
          error: false,
          message: "Account updated!",
          data: {},
        });
      } else {
        return response.status(400).json({
          error: true,
          message: "Failed to update account!",
          data: null,
        });
      }
    } catch (error) {
      return response.status(400).json({
        error: true,
        message: "Failed to update account!",
        data: null,
      });
    }
  },

  async delete(request, response, next) {
    try {
      const account = await Account.findByIdAndDelete(request.params.id);
      if (account != null) {
        return response.status(200).json({
          error: false,
          message: "Account deleted!",
          data: {},
        });
      } else {
        return response.status(200).json({
          error: false,
          message: "Can not find account!",
          data: null,
        });
      }
    } catch (error) {
      return response.status(400).json({
        error: true,
        message: "Failed to delete account!",
        data: null,
      });
    }
  },
};

module.exports = AccountController;
