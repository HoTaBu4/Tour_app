import express from "express";
import morgan from "morgan";

import toursRouter from "./routes/toursRoutes.js";
import usersRouter from "./routes/usersRoutes.js";

const app = express();

app.use(morgan('dev'));
app.use(express.json());


app.use('/api/v1/tours', toursRouter);
app.use('/api/v1/users', usersRouter);

export default app;