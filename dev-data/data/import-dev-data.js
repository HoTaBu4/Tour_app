import mongoose from "mongoose";
import fs from "fs";
import dotenv from "dotenv";
import Tour from "../../models/tourModel.js";
import { fileURLToPath } from "url";
import path from "path";

dotenv.config({ path: "./config.env" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 

const DB = process.env.DATABASE.replace(
  "<db_password>",
  process.env.DB_PASSWORD
);

mongoose.connect(DB)

// READ JSON FILE
const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`));
// IMPORT DATA INTO DB

const importData = async () => {
    try {
        await Tour.create(tours);
        console.log('Data successfully loaded!');

    } catch (err) {
        console.log(err);
    }
    process.exit();
};

const deleteData = async () => {
    try {
        await Tour.deleteMany();
        console.log('Data successfully deleted!');

    } catch (err) {
        console.log(err);
    }

    process.exit();
}

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

