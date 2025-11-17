import Tour from '../models/tourModel.js';
import AppError from '../utils/AppError.js';
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

'/tours-within/:distance/center/:latlng/unit/:unit'
'/tours-within/230/center/52.245395,20.940501/unit/mi'
export const getToursWithin = CatchAsync(async(req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',')

  const RADIUS_OF_EARTH_MILES = 3963.2
  const RADIUS_OF_EARTH_KILOMETS = 6378.1
  const MILES = 'mi'

  const radius = unit === MILES ? distance / RADIUS_OF_EARTH_MILES : distance / RADIUS_OF_EARTH_KILOMETS

  if (!lat || !lng) {
    next(new AppError('please provide lantitude and longtitudein the format lat, lng', 400))
  }

  console.log(distance, latlng, unit)
  const tours = await Tour.find({ startLocation: {
    $geoWithin: {
      $centerSphere: [[lng,lat], radius]
    }
  }})

  res.status(200).json({
    status: 'success',
    result: tours.length,
    data: {
      data: tours
    }
  })
})

export const getDistances = CatchAsync(async(req, res, next) => {
  const { latlng, unit} = req.params;
  const [lat, lng] = latlng.split(',')

  const MILES = 'mi'
  const MILSE_TO_METERS = 0.000621371
  const MULTIPLIER_METER_KILOMETR = 0.001

  const multiplier = unit === MILES ? MILSE_TO_METERS: MULTIPLIER_METER_KILOMETR


  if (!lat || !lng) {
    next(new AppError('please provide lantitude and longtitudein the format lat, lng', 400))
  }

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates: [lng * 1, lat * 1]
        },
        distanceField: 'distance',
        distanceMultiplier: multiplier
      }
    },
    {
      $project: {
        distance: 1,
        name: 1
      }
    }
  ])

  res.status(200).json({
    status: 'success',
    data: {
      data: distances
    }
  })
})