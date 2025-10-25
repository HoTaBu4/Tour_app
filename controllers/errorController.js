import AppError from "../utils/AppError.js";

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
};

const SendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack,
    });
}

const SendErrorProd = (err, res) => {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    // Programming or other unknown error: don't leak error details
    } else {
        console.error('ERROR 💥', err);
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!'
        });
    }
}  

export default (err, req, res, next) => {

  err.status = err.status || 'error';
  err.statusCode = err.statusCode || 500;

  if (process.env.ENVIROMENT === 'development') {
    SendErrorDev(err, res);
  } else if (process.env.ENVIROMENT === 'production') {
    let error = { ...err };
    if (err.name === 'CastError') {
      error = handleCastErrorDB(error);
    }
    SendErrorProd(error, res);
  }
}
