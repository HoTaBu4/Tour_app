import Tour from '../models/tourModel.js';
import APIFeatures from '../utils/apiFeatures.js';

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

export const getTourStats =  async(req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: {
          ratingsAverage: {$gte: 3.0}
        },
      },
      {
        $group: {
          _id: {$toUpper: '$difficulty'},
          numOfTours: { $sum: 1},
          numRatings: { $sum: '$ratingsQuantity'},
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        }
      },
      {
        $sort: {
          avgPrice: 1
        }
      },
    ])

    res.status(200).json({
      status: 'success',
      data: {
        stats
      }
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: 'Tour not found!'
    });
  }
}

export const getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1

    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates'
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: {
            $month: '$startDates'
          },
          numTourStarts: {$sum: 1},
          tours: {$push: '$name'}
        }
      },
      {
        $addFields: {month: '$_id'}
      },
      {
        $project:{
          _id: 0
        }
      },
      {
        $sort: {
          numTourStarts: -1
        }
      }
    ])

    res.status(200).json({
      status: 'success',
      data: {
        plan
      }
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: 'Tour not found!'
    });
  }
}