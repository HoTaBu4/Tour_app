import mongoose from "mongoose";
import app from "./app.js";
import dotenv from "dotenv";

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<db_password>",
  process.env.DB_PASSWORD
);

mongoose.connect(DB)

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
