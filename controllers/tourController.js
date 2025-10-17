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

export const getAllTours = async (req, res) => {
  try {
    // 1️ Make a shallow copy of query params
    const queryParams = { ...req.query };

    // 2️ Remove non-filtering fields
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(field => delete queryParams[field]);

    // 3️ Build a MongoDB-compatible filter object
    const filters = {};

    for (const [key, value] of Object.entries(queryParams)) {
      const match = key.match(/^(\w+)\[(gte|gt|lte|lt)\]$/);

      if (match) {
        const [, field, operator] = match;
        if (!filters[field]) filters[field] = {};
        filters[field][`$${operator}`] = isNaN(value) ? value : Number(value);
      } else {
        filters[key] = isNaN(value) ? value : Number(value);
      }
    }

    console.log('🔍 MongoDB Query:', filters);

    const tours = await Tour.find(filters);

    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: { tours },
    });

  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error.message,
    });
  }
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
     message: 'invalid data sent!'
   });
 }
};


export const getTour = async(req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // Tour.findOne({ _id: req.params.id });
    res.status(200).json({ status: "success", data: { tour } });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: 'Tour not found!'
    });
  }
}

export const deleteTour =  async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null
    });
    
  } catch (error) {
     res.status(404).json({
      status: "fail",
      message: 'Tour not found!'
    });
  }
};

export const updateTour = async (req, res) => {

  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
    
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: 'Tour not found!'
    });
  }
}
