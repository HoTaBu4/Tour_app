import Tour from '../models/tourModel.js';
import APIFeatures from '../utils/apiFeatures.js';
import CatchAsync from '../utils/catchAsync.js';

export const getAllTours = CatchAsync(async (req, res,next) => {
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
});

export const createTour = CatchAsync(async (req, res, next) => {
   const newTour = await Tour.create(req.body);
   res.status(201).json({
     status: "success",
     data: {
       tour: newTour
     }
   });
});


export const getTour = CatchAsync(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  // Tour.findOne({ _id: req.params.id });
  res.status(200).json({ status: "success", data: { tour } });
});

export const deleteTour = CatchAsync(async (req, res, next) => {
  await Tour.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: 'success',
    data: null
  });
});

export const updateTour = CatchAsync(async (req, res, next) => {
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
});

export const getTourStats = CatchAsync(async (req, res, next) => {
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
});

export const getMonthlyPlan = CatchAsync(async (req, res, next) => {
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
});