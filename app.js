import express from "express";
import morgan from "morgan";

import toursRouter from "./routes/toursRoutes.js";
import usersRouter from "./routes/usersRoutes.js";
import AppError from "./utils/AppError.js";
import errorController from "./controllers/errorController.js";

const app = express();

app.use(morgan('dev'));
app.use(express.json());


app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);

app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorController);

export default app;
