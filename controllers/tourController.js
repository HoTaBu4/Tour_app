import Tour from '../models/tourModel.js';

class APIFeatures {
  constructor (query ,queryString) {
    this.query = query
    this.queryString = queryString
  }

  filter () {
    const queryParams = { ...this.queryString };
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
    this.query = this.query.find(filters)

    return this
  };

  sort () {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this
  }

  limitFields () {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this
  }
  
  paginate () {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit); 

    return this
  }
}

export const getAllTours = async (req, res) => {
  try {

    // Execute query
    const Feature = new APIFeatures(Tour.find(),req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
      console.log('finl')

    const tours = await Feature.query;

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
