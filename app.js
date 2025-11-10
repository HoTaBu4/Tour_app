import express from "express";
import morgan from "morgan";

import toursRouter from "./routes/toursRoutes.js";
import usersRouter from "./routes/usersRoutes.js";
import AppError from "./utils/AppError.js";
import errorController from "./controllers/errorController.js";
import rateLimit from "express-rate-limit";
import helmet, { xssFilter } from "helmet";
import ExpressMongoSanitize from "express-mongo-sanitize";

const app = express();

//set security HTTP headers
app.use(helmet());

if (process.env.NODE_ENV === 'development'){
  app.use(morgan('dev'));
}

//limiting requests from same API
const limiter = rateLimit({
  max:100,
  windowMs:60 * 60 * 1000,
  message:'Too many requests from this IP, please try again in an hour!'
})

//body parser, reading data from body into req.body
app.use(express.json({
  limit:'10kb'
}));

//sanitize data against NoSQL query injection
app.use(ExpressMongoSanitize());

//sanitize data against XSS
app.use(xssFilter());

//prevent parameter pollution
app.use(hpp(
  {
    whitelist:[
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price'
    ]
  }
))

app.use('/api', limiter);

app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);

app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorController);

export default app;
