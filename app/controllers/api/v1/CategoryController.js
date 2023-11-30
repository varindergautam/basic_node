const Joi = require("joi");
const Category = require("../../../models/Category");
const defaultHelper = require("../../../../helper/defaultHelper");
const fs = require('fs');

const list = async (req, res, next) => {
  try {
    const user = {user_id: req.user.data.id};
    const category = await Category.find(user);
    if (category.length !== 0) {
      var statusCode = 200;
      var response = {
        status: true,
        message: "success",
        result: category,
      };
      return defaultHelper.sendResponse(res, statusCode, response);
    } else {
      var statusCode = 400;
      var response = {
        status: false,
        message: "no data found",
        result: "",
      };
      return defaultHelper.sendResponse(res, statusCode, response);
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const store = async (req, res, next) => {
  const user = req.user;

  try {
    const schema = Joi.object({
      name: Joi.string().required(),
      description: Joi.string().required(),
    });

    const data = {
      name: req.body.name,
      description: req.body.description,
    };

    // Validate the data with abortEarly option set to false
    const { error } = schema.validate(data, {
      abortEarly: false,
    });

    if (error) {
      const statusCode = 400;
      const errorMessages = error.details.map((error) => error.message);
      const response = {
        status: false,
        message: "Validation failed",
        result: errorMessages,
      };
      return defaultHelper.sendResponse(res, statusCode, response);
    }

    if (!req.file) {
      const statusCode = 400;
      const response = {
        status: false,
        message: "Image parameter is missing",
        result: "",
      };
      return defaultHelper.sendResponse(res, statusCode, response);
    }

    const { error: imageError } = Joi.object({
      fieldname: Joi.string().required(),
      originalname: Joi.string().required(),
      encoding: Joi.string().required(),
      mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/gif').required(),
      destination: Joi.string().required(),
      filename: Joi.string().required(),
      path: Joi.string().required(),
      size: Joi.number().required(),
    }).validate(req.file);

    if (imageError) {
      const statusCode = 400;
      const response = {
        status: false,
        message: "Invalid image parameter",
        result: imageError.details[0].message,
      };
      return defaultHelper.sendResponse(res, statusCode, response);
    }

    // The rest of your code for checking if the name exists and saving the category...
    var name = data.name;
    var checkExists = await Category.findOne({ name });
    if (checkExists) {
      var statusCode = 400;
      var response = {
        status: false,
        message: "name  exists",
        result: "",
      };
      return defaultHelper.sendResponse(res, statusCode, response);
    } else {
      data.user_id = user.data.id;
      data.image = req.file.filename;
      const category = new Category(data);
      category
        .save()
        .then(() => {
          var statusCode = 200;
          var response = {
            status: true,
            message: "success",
            result: category,
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

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


module.exports = { store, list };
