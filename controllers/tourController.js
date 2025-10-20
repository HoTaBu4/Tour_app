import Tour from '../models/tourModel.js';

export const getAllTours = async (req, res) => {
  try {
    const queryParams = { ...req.query };

    // 1. Remove fields not used for filtering
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(field => delete queryParams[field]);

    // 2. Build filters
    const filters = {};
    for (const [key, value] of Object.entries(queryParams)) {
      const match = key.match(/^(\w+)\[(gte|gt|lte|lt)\]$/);
      if (match) {
        const [, field, operator] = match;
        if (!filters[field])  {
          filters[field] = {};
        }
        filters[field][`$${operator}`] = isNaN(value) ? value : Number(value);
      } else {
        filters[key] = isNaN(value) ? value : Number(value);
      }
    }

    // 3. Build query
    let query = Tour.find(filters);

    // 4. Sorting
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // 5. Field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // 6. Pagination + limit
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit); 

    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) {
        throw new Error('This page does not exist');
      }
    }

    // 7. Execute query
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
