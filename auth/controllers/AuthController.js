const { AccountStatus } = require("../../config/constants");
const { validationResult } = require("express-validator");

const User = require("../../features/users/models/UserModel");
const SalesPerson = require("../../features/users/models/SalesPersonModel");
const Authentication = require("../services/AuthService");
const bcrypt = require("bcrypt");
const Role = require("../../features/users/models/RoleModel");

const mongoose = require("mongoose");

const AuthController = {
  async login(request, response, next) {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: "Validation errors",
        data: errors,
      });
    }

    const { email, password } = request.body;

    try {
      const user = await User.findOne({ email: email }).populate('role', 'name _id status portData infoData Vessel dsr user');

      if (!user) {
        return response.status(401).json({
          error: true,
          message: "Invalid email or password.",
          data: null,
        });
      }

      if (user.status === 'Inactive') {
        return response.status(401).json({
          error: true,
          message: "User Inactivated.",
          data: null,
        });
      }

      if (!user.comparePassword(password)) {
        return response.status(401).json({
          error: true,
          message: "Invalid email or password.",
          data: null,
        });
      }

      Authentication.signToken(user, response, next);
    } catch (error) {
      return response.status(400).json({
        error: true,
        message: "Login Failed!",
        data: null,
      });
    }
  },

  async register(request, response, next) {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
      return response.status(422).json({
        error: true,
        message: "Validation errors",
        data: errors,
      });
    }

    const {
      name,
      email,
      password,
      phone,
      dob,
      address,
      startDate,
      note,
      roleId,
      jobRole,
      document,
      company,
      employId
    } = request.body;

    console.log(
      name,
      email,
      password,
      phone,
      dob,
      address,
      startDate,
      note,
      roleId,
      jobRole,
      document,
      company,
      employId)
    try {
      const user = await User.findOne({ email: email });

      if (user) {
        return response.status(400).json({
          error: true,
          message: "Email already using.",
          data: null,
        });
      }
      
      const role = await Role.findById(roleId);
      
      const newUser = await User({
        _id: new mongoose.Types.ObjectId(),
        name,
        email,
        phone,
        dateOfBirth: dob,
        address,
        startDate,
        note,
        role,
        jobRole: jobRole,
        password: bcrypt.hashSync(password, 10),
        accountStatus: AccountStatus.ACTIVE,
        company,
        employId
        // documents: {
        //     fileUrl: document,
        // }
      }).save();

      if(role.name=='Sales person'){
        const newSalesPerson = await SalesPerson({
          id: newUser._id,
          name,
          company
          // documents: {
          //     fileUrl: document,
          // }
        }).save();
      }

      console.log("new user", newUser);

      Authentication.signToken(newUser, response, next);
    } catch (error) {
      console.log(error);
      return response.status(400).json({
        error: true,
        message: "Registration Failed!",
        data: null,
      });
    }
  },

  async me(request, response, next) {
    const user = await User.findById(request.user._id)
      .populate({
        path: "role",
        populate: ["portData","infoData","Vessel","dsr","user"],
      })
      .select(["-password"]);

    return response.status(200).json({
      error: false,
      message: "Account retrieved!",
      data: {
        user,
      },
    });
  },
};

module.exports = AuthController;
