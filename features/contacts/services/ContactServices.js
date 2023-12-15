const Contact = require("../models/ContactModel");
const mongoose = require("mongoose");

const ContactService = module.exports;

ContactService.createContact = async function (payload, request) {
  const { name, title, accountName, status } = payload;
  try {
    const newContact = await Contact.create({
      _id: new mongoose.Types.ObjectId(),
      name,
      title,
      accountName,
      status,
    });
    return newContact;
  } catch (err) {
    return { error: err };
  }
};

ContactService.updateContact = async function (payload, request) {
  const { name, title, accountName, status } = payload;
  try {
    const { id } = request.params;
    const contact = await Contact.findByIdAndUpdate(id, {
      name,
      title,
      accountName,
      status,
    });
    return contact;
  } catch (err) {
    return { error: err };
  }
};
