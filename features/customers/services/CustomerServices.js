const Customer = require('../models/CustomerModel');
const mongoose = require('mongoose');

const CustomerService = module.exports;

CustomerService.createCustomer = async function (payload, request) {
    const { name, email, phone, age, status, address, country, zipCode, website, description, photo } = payload;
    try {
        const newCustomer = await Customer.create({
            _id: new mongoose.Types.ObjectId(),
            name,
            email,
            phone,
            age,
            address,
            country,
            zipCode,
            web: website,
            imageUrl: photo,
            description,
            status

            // _id: new mongoose.Types.ObjectId(),
            // name,
            // email,
            // phone,
            // age,
            // address,
            // country,
            // zipCode,
            // web,
            // imageUrl,
            // description,
            // accountStatus: status
        })
        return newCustomer;
    } catch (err) {
        return { error: err };
    }
};

CustomerService.updateCustomer = async function (payload, request) {
    const { name, email, phone, age, status, address, country, zipCode, website, description, photo } = payload;
    try {
        const { id } = request.params;
        const customer = await Customer.findByIdAndUpdate(id, {
            name,
            email,
            phone,
            age,
            address,
            country,
            zipCode,
            web: website,
            imageUrl: photo,
            description,
            status
        });
        return customer;
    } catch (err) {
        return { error: err };
    }
};