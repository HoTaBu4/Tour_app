import express from "express";
import morgan from "morgan";

import toursRouter from "./routes/toursRoutes.js";
import usersRouter from "./routes/usersRoutes.js";
import reviewsRouter from "./routes/reviewsRoutes.js";
import AppError from "./utils/AppError.js";
import errorController from "./controllers/errorController.js";
import rateLimit from "express-rate-limit";
import helmet, { xssFilter } from "helmet";
import ExpressMongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import path from 'path';
import { fileURLToPath } from "url";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 

app.set('view engine', 'pug')
app.set('views', path.join(__dirname, 'views'))

//serving static files
app.use(express.static(path.join(__dirname,'public')))

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

//sanitize data against NoSQL query injection without reassigning req.query
const sanitizeRequest = (req, res, next) => {
  ['body', 'params', 'headers', 'query'].forEach((key) => {
    if (req[key]) {
      ExpressMongoSanitize.sanitize(req[key]);
    }
  });
  next();
};
app.use(sanitizeRequest);

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

//routes
app.get('/', (req, res ) => {
  res.status(200).render('base')
})

app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/reviews', reviewsRouter);

app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorController);

export default app;
