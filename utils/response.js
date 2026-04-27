const successResponse = (res, message, data = null, status = 200) => {
  return res.status(status).json({
    success: true,
    message,
    data,
    error: null,
  });
};

const errorResponse = (res, message, status = 500, error = null) => {
  return res.status(status).json({
    success: false,
    message,
    data: null,
    error: {
      code: status,
      details: error,
    },
  });
};

export { successResponse, errorResponse };
