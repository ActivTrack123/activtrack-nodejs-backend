const { validationResult } = require("express-validator");
const Permission = require('../models/PermissionModel');
const { default: mongoose } = require("mongoose");

const PermissionController = {
    async index(request, response, next) {

        const errors = validationResult(request);

        if (!errors.isEmpty()) {
            return response.status(422).json({
                error: true,
                message: 'Validation errors',
                data: errors,
            });
        }

        try {

            const { page = 1, limit = 10, query: name } = request.query;

            const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

            const query = {};
            if (name) {
                query.name = { $regex: new RegExp(name), $options: 'i' };
            }

            const permissions = await Permission.find(query).limit(parseInt(limit, 10)).skip(skip).sort({ created: -1 });

            const total = await Permission.countDocuments(query);

            return response.status(200).json({
                error: false,
                message: 'Permission list retrieved!',
                data: {
                    permissions,
                    total,
                    limit: permissions.length,
                    page: parseInt(page, 10),
                },
            });
        } catch (error) {
            console.log(error);
            return response.status(400).json({
                error: true,
                message: 'Failed to fetch Permission list!',
                data: null,
            });
        }
    },

    async create(request, response, next) {
        const errors = validationResult(request);

        if (!errors.isEmpty()) {
            return response.status(422).json({
                error: true,
                message: 'Validation errors',
                data: errors,
            });
        }

        try {
            const { name, slug } = request.body;

            const permission = await Permission({
                _id: new mongoose.Types.ObjectId(),
                name,
                slug,
            }).save();

            return response.status(200).json({
                error: false,
                message: 'Permission created!',
                data: permission,
            });
        } catch (error) {
            return response.status(400).json({
                error: true,
                message: 'Failed to create permission!',
                data: null,
            });
        }
    },

    async update(request, response, next) {
        const errors = validationResult(request);

        if (!errors.isEmpty()) {
            return response.status(422).json({
                error: true,
                message: 'Validation errors',
                data: errors,
            });
        }

        try {
            const { name, slug } = request.body;

            const permission = await Permission.findByIdAndUpdate(request.params.id, {
                name,
                slug,
            }, { new: true });

            return response.status(200).json({
                error: false,
                message: 'Permission updated!',
                data: permission,
            });
        } catch (error) {
            return response.status(400).json({
                error: true,
                message: 'Failed to update permission!',
                data: null,
            });
        }
    }
}

module.exports = PermissionController