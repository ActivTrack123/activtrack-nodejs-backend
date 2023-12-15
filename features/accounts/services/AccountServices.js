const Account = require("../models/AccountModel");
const mongoose = require("mongoose");

const AccountService = module.exports;

AccountService.createAccount = async function (payload, request) {
  const { accountName, phoneNumber, accountOwnerAlias, status } = payload;
  try {
    const newAccount = await Account.create({
      _id: new mongoose.Types.ObjectId(),
      accountName,
      phoneNumber,
      accountOwnerAlias,
      status,
    });
    return newAccount;
  } catch (err) {
    return { error: err };
  }
};

AccountService.updateAccount = async function (payload, request) {
  const { accountName, phoneNumber, accountOwnerAlias, status } = payload;
  try {
    const { id } = request.params;
    const account = await Account.findByIdAndUpdate(id, {
      accountName,
      phoneNumber,
      accountOwnerAlias,
      status,
    });
    return account;
  } catch (err) {
    return { error: err };
  }
};
