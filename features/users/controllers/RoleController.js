const Role = require('../models/RoleModel');
const Permission = require('../models/PermissionModel');
const RolePermission = require('../models/RolePermissionModel');
const { validationResult } = require("express-validator");
const { default: mongoose } = require('mongoose');

const RoleController = {
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

            // const roles = await Role.find(query).populate({
            //     path: 'rolePermissions',
            //     populate: ['permission'],
            // }).limit(parseInt(limit, 10)).skip(skip).sort({ created: -1 });
            const roles = await Role.find(query).limit(parseInt(limit, 10)).skip(skip).sort({ created: -1 });

            const total = await Role.countDocuments(query);

            return response.status(200).json({
                error: false,
                message: 'Role list retrieved!',
                data: {
                    roles,
                    total,
                    limit: roles.length,
                    page: parseInt(page, 10),
                },
            });
        } catch (error) {
            console.log(error);
            return response.status(400).json({
                error: true,
                message: 'Failed to fetch roles list!',
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
            const { name, portData, infoData, Vessel, dsr ,user } = request.body;

            const role = await Role({
                _id: new mongoose.Types.ObjectId(),
                name,
                portData, 
                infoData, 
                Vessel, 
                dsr,
                user
            }).save();

            // permissions.forEach(async (permission) => {
            //     const rolePermission = await RolePermission({
            //         _id: new mongoose.Types.ObjectId(),
            //         permission: permission.id,
            //         role: role.id,
            //         create: permission.create,
            //         read: permission.read,
            //         delete: permission.delete,
            //         update: permission.update,
            //     }).save();

            //     await Role.findByIdAndUpdate(role.id, { $push: { rolePermissions: rolePermission.id } })
            // });

            return response.status(200).json({
                error: false,
                message: 'Role created!',
                data: role,
            });
        } catch (error) {
            return response.status(400).json({
                error: true,
                message: 'Failed to create new role',
                data: null,
            });
        }
    },

    // async create(request, response, next) {
    //     const errors = validationResult(request);

    //     if (!errors.isEmpty()) {
    //         return response.status(422).json({
    //             error: true,
    //             message: 'Validation errors',
    //             data: errors,
    //         });
    //     }

    //     try {
    //         const { name, permissions } = request.body;

    //         const role = await Role({
    //             _id: new mongoose.Types.ObjectId(),
    //             name,
    //             rolePermissions: []
    //         }).save();

    //         permissions.forEach(async (permission) => {
    //             const rolePermission = await RolePermission({
    //                 _id: new mongoose.Types.ObjectId(),
    //                 permission: permission.id,
    //                 role: role.id,
    //                 create: permission.create,
    //                 read: permission.read,
    //                 delete: permission.delete,
    //                 update: permission.update,
    //             }).save();

    //             await Role.findByIdAndUpdate(role.id, { $push: { rolePermissions: rolePermission.id } })
    //         });

    //         return response.status(200).json({
    //             error: false,
    //             message: 'Role created!',
    //             data: role,
    //         });
    //     } catch (error) {
    //         return response.status(400).json({
    //             error: true,
    //             message: 'Failed to create new role',
    //             data: null,
    //         });
    //     }
    // },

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
            const { name, portData, infoData, Vessel, dsr ,user } = request.body;

            const role = await Role.findByIdAndUpdate(request.params.id, 
                {
                    name: name,
                    portData: portData,
                    infoData: infoData,
                    Vessel: Vessel,
                    dsr: dsr,
                    user: user,
                },
                { new: true });

            // permissions.forEach(async (permission) => {
            //     await RolePermission.findByIdAndUpdate(permission.permissionId, {
            //         create: permission.create,
            //         read: permission.read,
            //         delete: permission.delete,
            //         update: permission.update,
            //     });
            // });

            return response.status(200).json({
                error: false,
                message: 'Role updated!',
                data: role,
            });

        } catch (error) {
            return response.status(400).json({
                error: true,
                message: 'Failed to create new role',
                data: null,
            });
        }
    },

    async delete(request, response, next) {
        try {
            const user = await Role.findByIdAndDelete(request.params.id);

            if (user != null) {
                return response.status(200).json({
                    error: false,
                    message: 'Role deleted!',
                    data: {},
                });
            }
            else {
                return response.status(200).json({
                    error: false,
                    message: 'Can not find role!',
                    data: null,
                });
            }
        } catch (error) {
            return response.status(400).json({
                error: true,
                message: 'Failed to delete role!',
                data: null,
            });
        }
    },

    async show(request, response, next) {
        try {
            const role = await Role.findById(request.params.id);

            return response.status(200).json({
                error: false,
                message: 'Role retrieved!',
                data: role,
            });
        } catch (error) {
            return response.status(400).json({
                error: true,
                message: 'Failed to fetch role!',
                data: null,
            });
        }
    },
}

module.exports = RoleController;
