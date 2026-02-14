/**
 * Standardize API responses
 */
export const sendResponse = (
  res,
  statusCode,
  success,
  message,
  data = null,
) => {
  const response = {
    success,
    message,
  };

  if (data) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

export const successResponse = (
  res,
  message,
  data = null,
  statusCode = 200,
) => {
  return sendResponse(res, statusCode, true, message, data);
};

export const errorResponse = (res, message, statusCode = 500, errors = []) => {
  const response = {
    success: false,
    message,
  };

  if (errors.length > 0) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};
