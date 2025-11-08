import express from "express";
import morgan from "morgan";

import toursRouter from "./routes/toursRoutes.js";
import usersRouter from "./routes/usersRoutes.js";
import AppError from "./utils/AppError.js";
import errorController from "./controllers/errorController.js";
import rateLimit from "express-rate-limit";

const app = express();

app.use(morgan('dev'));
app.use(express.json());

const limiter = rateLimit({
  max:100,
  windowMs:60 * 60 * 1000,
  message:'Too many requests from this IP, please try again in an hour!'
})

app.use('/api', limiter);

app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);

app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorController);

export default app;
