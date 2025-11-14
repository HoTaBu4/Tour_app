import Tour from '../models/tourModel.js';
import CatchAsync from '../utils/catchAsync.js';
import handleFactory from './handleFactory.js';

export const getAllTours = handleFactory.getAll(Tour);
export const createTour = handleFactory.createOne(Tour)
export const getTour = handleFactory.getOne(Tour, {path: 'reviews'})
export const deleteTour = handleFactory.deleteOne(Tour)
export const updateTour = handleFactory.updateOne(Tour);


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