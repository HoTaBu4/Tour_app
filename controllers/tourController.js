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
    const queryParams = { ...req.query };

    // 1 Remove fields that are not used for filtering (API features)
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(field => delete queryParams[field]);

    // 2 Convert query parameters into a Mongoose-compatible filter object
    const filters = {};

    for (const [key, value] of Object.entries(queryParams)) {
      const match = key.match(/^(\w+)\[(gte|gt|lte|lt)\]$/);

      if (match) {
        const [, field, operator] = match;

        // Initialize the field if it doesn’t exist yet
        if (!filters[field]) {
          filters[field] = {};
        }

        // Add MongoDB operator (e.g. $lte, $gte)
        // Convert numeric strings ("5") to numbers (5)
        filters[field][`$${operator}`] = isNaN(value) ? value : Number(value);
      } else {
        // Otherwise, treat it as a normal field (no operator)
        filters[key] = isNaN(value) ? value : Number(value);
      }
    }

    // 3 Start building the query
    let query = Tour.find(filters);

    // 4 Sorting feature
    if (req.query.sort) {
      // Example: ?sort=price,duration → "price duration"
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      // Default sort by creation date (descending)
      query = query.sort('-createdAt');
    }

    // limitation

    if (req.query.fields) {
      const fields = req.query.split(',').join(' ')
      query = query.select(fields)
    } else {
      query.select('-__v')
    }

    //pagination
    const page = req.query.page * 1 || 1
    const limit = req.query.limit * 1 || 100
    const skip = (page - 1) * limit 

    query.skip(skip).limit(limit)

    if (req.query.page) {
      const numTours = Tour.countDocuments()
      if (skip >= numTours) {
        throw new Error('this page does not exist')
      }
    }

    const tours = await query;

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
