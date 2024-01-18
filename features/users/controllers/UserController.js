const User = require('../models/UserModel');
const Role = require('../models/RoleModel');
const bcrypt = require('bcrypt');
const { AccountStatus } = require('../../../config/constants');
const { validationResult } = require("express-validator");
const { default: mongoose } = require('mongoose');

const UserController = {
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

            const { page = 1, limit = 10, query: name, status, role } = request.query;

            const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

            const query = {};
            if (name) {
                const nameRegex = { $regex: new RegExp(name), $options: 'i' };
                query.$or = [
                    { name: nameRegex },
                    { email: nameRegex },
                    { company: nameRegex },

                ];
            }
            if (status) {
                const statusArr = status.split(',');
                query.accountStatus = { $in: statusArr };
            }
            if (role) {
                const roleArr = role.split(',');
                query['role._id'] = { $in: roleArr };
            }
            console.log(query)

            const users = await User.find(query).limit(parseInt(limit, 10)).skip(skip).sort({ created: -1 }).select(['-password']).populate('role', 'name _id portData infoData Vessel dsr user');
            const total = await User.countDocuments(query);

            return response.status(200).json({
                error: false,
                message: 'User list retrieved!',
                data: {
                    users,
                    total,
                    limit: users.length,
                    page: parseInt(page, 10),
                },
            });
        } catch (error) {
            console.log(error);
            return response.status(400).json({
                error: true,
                message: 'Failed to fetch users list!',
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
        // console.log("user new", request.body);
        const { name, email, password, phone, dateOfBirth, address, start_date, note, role_id, job_role, document, photo,company, employId,status } = request.body;
        // console.log( phone, dateOfBirth, address, start_date, note, role_id, job_role, document, photo,company )
        try {
            const user = await User.findOne({ "email": email });

            if (user) {
                return response.status(400).json({
                    error: true,
                    message: 'Email already using.',
                    data: null,
                });
            }

            const role = await Role.findById(role_id);

            const newUser = await User({
                _id: new mongoose.Types.ObjectId(),
                name,
                email,
                phone,
                dateOfBirth,
                address,
                startDate: start_date,
                note,
                role,
                company,
                jobRole: job_role,
                password: bcrypt.hashSync(password, 10),
                accountStatus: AccountStatus.ACTIVE,
                documents: document,
                photo,
                status,
                employId
            }).save();

            return response.status(200).json({
                error: false,
                message: 'User created!',
                data: newUser,
            });
        } catch (error) {
            console.log(error)
            return response.status(400).json({
                error: true,
                message: 'Registration Failed!',
                data: null,
            });
        }
    },

    async show(request, response, next) {
        try {
            const user = await User.findById(request.params.id).select(['-password']);

            return response.status(200).json({
                error: false,
                message: 'User retrieved!',
                data: user,
            });
        } catch (error) {
            return response.status(400).json({
                error: true,
                message: 'Failed to fetch user!',
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

        // console.log("update user", request.body);

        const { name, email, password, phone, dateOfBirth, address, startDate, note, role, jobRole, document, photo,company, employId,status } = request.body;

        try {
            // const role = await Role.findById(role_id);

            if (password) {
                await User.findByIdAndUpdate(request.params.id, {
                    password: bcrypt.hashSync(password, 10),
                });
            }

            if (photo) {
                await User.findByIdAndUpdate(request.params.id, {
                    photo: photo,
                });
            }

            const user = await User.findByIdAndUpdate(request.params.id, {
                name,
                email,
                phone,
                dateOfBirth,
                address,
                startDate,
                note,
                documents: document,
                role,
                jobRole,
                company,
                employId,
                status
            }, { new: true });

            if (user != null) {
                return response.status(200).json({
                    error: false,
                    message: 'User updated!',
                    data: user,
                });
            }
            else {
                return response.status(400).json({
                    error: true,
                    message: 'Failed to update user!',
                    data: null,
                });
            }
        } catch (error) {
            console.log(error)
            return response.status(400).json({
                error: true,
                message: 'Failed to update user!',
                data: null,
            });
        }
    },

    async delete(request, response, next) {
        try {
            const user = await User.findByIdAndDelete(request.params.id);

            if (user != null) {
                return response.status(200).json({
                    error: false,
                    message: 'User deleted!',
                    data: {},
                });
            }
            else {
                return response.status(200).json({
                    error: false,
                    message: 'Can not find user!',
                    data: null,
                });
            }
        } catch (error) {
            return response.status(400).json({
                error: true,
                message: 'Failed to delete user!',
                data: null,
            });
        }
    },
}

module.exports = UserController;
