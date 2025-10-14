import fs from 'fs';
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); 

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

export const checkID = (req, res, next, val) => {
  const tour = tours.find(t => t.id === parseInt(req.params.id));
    if (!tour) {
    return res.status(404).json({ status: "fail", message: "Tour not found" });
  }
  next();
};

export const checkForDataTour = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    res.status(400).json({
      status: "fail",
      message: "Missing tour name or price"
    });
  } else {
    next();
  }
};



export const getAllTours = (req, res) => {
  const toursData = tours;
  res.status(200).json({
    status: "success",
    data: {
      tours: toursData
    }
  })
};

export const createTour = (req, res) => {

  const newTour = Object.assign({ id: tours.length + 1 }, req.body);

  tours.push(newTour);

  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => {
   res.status(201).json({
    status: "success",
    data: {
      tour: newTour
    }
   });
  });
}

export const getTour = (req, res) => {
  const tour = tours.find(t => t.id === parseInt(req.params.id));
  res.status(200).json({ status: "success", data: { tour } });
}

export const deleteTour = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null
  });
};

export const updateTour = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>'
    }
  });
}
