const Joi = require("joi");
const defaultHelper = require("../../../../helper/defaultHelper");
const User = require("../../../models/User");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const login = async (req, res, next) => {
  try {
    // Define a schema for validation
    const userSchema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });

    var userData = {
      email: req.body.email,
      password: req.body.password,
    };

    // Validate the data with abortEarly option set to false
    const { error, value } = userSchema.validate(userData, {
      abortEarly: false,
    });

    if (error) {
      var statusCode = 400;
      const errorMessages = error.details.map((error) => error.message);
      const response = {
        status: false,
        message: "failed",
        result: errorMessages,
      };
      return defaultHelper.sendResponse(res, statusCode, response);
    }

    var email = req.body.email;
    var checkUser = await User.findOne({ email });
    if (!checkUser) {
      var statusCode = 400;
      var response = {
        status: false,
        message: "Email not exists",
        result: "",
      };
      return defaultHelper.sendResponse(res, statusCode, response);
    } else {
      bcrypt.compare(
        req.body.password,
        checkUser.password,
        function (err, result) {
          if (result) {
            checkUser.token = defaultHelper.jwtToken(email);
            // Save the updated user object to the database
            checkUser.save();

            var statusCode = 200;
            var response = {
              status: true,
              message: "success",
              result: checkUser,
            };
            return defaultHelper.sendResponse(res, statusCode, response);
          } else {
            var statusCode = 400;
            var response = {
              status: false,
              message: "pasword not matched",
              result: null,
            };
            return defaultHelper.sendResponse(res, statusCode, response);
          }
        }
      );
    }
  } catch (error) {
    // Handle and log any unexpected errors
    console.error("An unexpected error occurred:", error);
    return res.status(500).json({ error: error.message });
  }
};

const register = async (req, res, next) => {
  try {
    // Define a schema for validation
    const userSchema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
      // .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
    });

    // Hash the password
    bcrypt.hash(req.body.password, saltRounds, async (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({ error: err });
      } else {
        // Data to be validated
        var userData = {
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword,
        };

        // Validate the data with abortEarly option set to false
        const { error, value } = userSchema.validate(userData, {
          abortEarly: false,
        });

        if (error) {
          var statusCode = 400;
          const errorMessages = error.details.map((error) => error.message);
          const response = {
            status: false,
            message: "failed",
            result: errorMessages,
          };
          return defaultHelper.sendResponse(res, statusCode, response);
        } else {
          const email = req.body.email;
          const checkEmail = await User.findOne({ email });

          if (checkEmail !== null) {
            var statusCode = 400;
            var response = {
              status: false,
              message: "Email already exists",
              result: "",
            };
            return defaultHelper.sendResponse(res, statusCode, response);
          } else {
            const user = new User(userData);
            user.token = defaultHelper.jwtToken(email);
            user
              .save()
              .then(() => {
                var statusCode = 200;
                var response = {
                  status: true,
                  message: "success",
                  result: user,
                };
                return defaultHelper.sendResponse(res, statusCode, response);
              })
              .catch((error) => {
                var statusCode = 500;
                var response = {
                  status: false,
                  message: "fail",
                  result: error,
                };
                return defaultHelper.sendResponse(res, statusCode, response);
              });
          }
        }
      }
    });
  } catch (error) {
    // Handle and log any unexpected errors
    console.error("An unexpected error occurred:", error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = { login, register };
