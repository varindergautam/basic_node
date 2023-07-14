
const jwt = require('jsonwebtoken');

function jwtToken(data) {
  return jwt.sign({ data }, 'secretKey', { expiresIn: '1h' })
}


function sendAjaxResponse(
  valid,
  message,
  redirect = "",
  data = [],
  validations = []
) {
  if (!valid) {
    // parameter is an exception object
    message = message.message;
  }
  const response = [
    { valid: valid },
    { error: message },
    { data: data },
    { redirect: redirect },
    { validations: validations },
  ];

  return res.json(response);
}

function sendResponse(res, statusCode, response) {
  try {
    const data = {
      status: response.status,
      message: response.message,
      result: response.result
    };
  
    res.status(statusCode).json(data);
  } catch (ex) {
    //showException(ex);
  }
}

function showException(exception, code = "500") {
  const message = exception.message;

  if (!(typeof exception === "string")) {
    const user = auth().user(); // Replace 'auth()' with the appropriate method for retrieving the authenticated user
    Log.debug("Error caught while sending API response.");

    if (user) {
      Log.debug(`User for this error is ${user.id} ${user.email}`);
      Log.debug("Request Data");
      Log.debug(JSON.stringify(request.body));
      Log.debug(request.url);
      Log.debug(request.path);
    } else {
      Log.debug("Error without login");
    }

    Log.debug(exception.message + "\n");
    Log.debug(exception.stack + "\n");
  }

  const exceptionErrorResponse = {
    CODE: code,
    MESSAGE: message,
    RESULT: [],
  };

  if (App.hasDebugModeEnabled()) {
    // Replace 'App.hasDebugModeEnabled()' with the appropriate method for checking if debug mode is enabled
    exceptionErrorResponse.EXCEPTION = exception.stack;
  }

  const responseCode =
    typeof code === "number" && code > 0 ? code : config.HttpCodes.fail;

  new Response(exceptionErrorResponse, config.HttpCodes.fail)
    .header("Content-Type", "application/json")
    .send();

  process.exit();
}

module.exports = { sendResponse, sendAjaxResponse, jwtToken };