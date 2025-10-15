import Tour from '../models/tourModel.js';

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
  res.status(200).json({
    status: "success",
    data: {
      // tours: toursData
    }
  })
};

export const createTour = async (req, res) => {
 try {
   const newTour = await Tour.create(req.body);
   res.status(201).json({
     status: "success",
     data: {
       tour: newTour
     }
   });
 } catch (error) {
   res.status(400).json({
     status: "fail",
     message: error.message
   });
 }
};


export const getTour = (req, res) => {
  res.status(200).json({ status: "success", data: { tour: '<Here is your tour...>' } });
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
