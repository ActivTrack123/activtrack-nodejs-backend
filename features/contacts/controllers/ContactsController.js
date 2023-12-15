const Contact = require("../models/ContactModel");
const ContactService = require("../services/ContactServices");
const { validationResult } = require("express-validator");
const { default: mongoose } = require("mongoose");

const ContactsController = {
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
      const allowedSortValues = ["name", "title", "accountName", "status"];

      if (allowedSortValues.includes(sortBy)) {
        sort[sortBy] = 1; //Can change the sort direction (1 for ascending, -1 for descending)
      } else {
        // Default sorting if sortBy is not provided or is not an allowed value
        sort.created = -1;
      }

      const contacts = await Contact.find(query)
        .sort(sort)
        .limit(parseInt(limit, 10))
        .skip(skip)
        .sort({ created: -1 });
      const total = await Contact.countDocuments(query);

      return response.status(200).json({
        error: false,
        message: "Contact list retrieved!",
        data: {
          contacts,
          total,
          limit: contacts.length,
          page: parseInt(page, 10),
        },
      });
    } catch (error) {
      console.log(error);
      return response.status(400).json({
        error: true,
        message: "Failed to fetch contact list!",
        data: null,
      });
    }
  },

  async show(request, response, next) {
    try {
      const contact = await Contact.findById(request.params.id);

      return response.status(200).json({
        error: false,
        message: "Contact retrieved!",
        data: contact,
      });
    } catch (error) {
      return response.status(400).json({
        error: true,
        message: "Failed to fetch contact!",
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
      const newContact = await ContactService.createContact(payload, request);
      if (!newContact.error) {
        return response.status(200).json({
          error: false,
          message: "Contact created!",
          data: newContact,
        });
      } else {
        return response.status(400).json({
          error: true,
          message: "Failed to create contact!",
          data: null,
        });
      }
    } catch (error) {
      console.log(error);
      return response.status(400).json({
        error: true,
        message: "Failed to create contact!",
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
      const contact = await ContactService.updateContact(payload, request);
      if (!contact.error && contact != null) {
        return response.status(200).json({
          error: false,
          message: "Contact updated!",
          data: contact,
        });
      } else {
        return response.status(400).json({
          error: true,
          message: "Failed to update contact!",
          data: null,
        });
      }
    } catch (error) {
      return response.status(400).json({
        error: true,
        message: "Failed to update contact!",
        data: null,
      });
    }
  },

  async delete(request, response, next) {
    try {
      const contact = await Contact.findByIdAndDelete(request.params.id);
      if (contact != null) {
        return response.status(200).json({
          error: false,
          message: "contact deleted!",
          data: contact,
        });
      } else {
        return response.status(200).json({
          error: false,
          message: "Can not find contact!",
          data: null,
        });
      }
    } catch (error) {
      return response.status(400).json({
        error: true,
        message: "Failed to delete contact!",
        data: null,
      });
    }
  },
};

module.exports = ContactsController;
