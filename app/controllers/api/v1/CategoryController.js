const Joi = require("joi");
const Category = require("../../../models/Category");
const defaultHelper = require("../../../../helper/defaultHelper");

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

    var data = {
      name: req.body.name,
      description: req.body.description,
    };

    // Validate the data with abortEarly option set to false
    const { error, value } = schema.validate(data, {
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
