import multer from 'multer';
import Tour from '../models/tourModel.js';
import AppError from '../utils/AppError.js';
import CatchAsync from '../utils/catchAsync.js';
import handleFactory from './handleFactory.js';
import sharp from 'sharp';

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
}

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter 
});

export const uploadTourImages = upload.fields([
  // Expect a single cover image and up to three gallery images
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 }
]);

export const resizeTourImages = CatchAsync( async(req, res, next) => {
  if (!req.files.imageCover || !req.files.images) {
    return next();
  }

  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;

  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${req.body.imageCover}`);

  
  req.body.images = [];

  await Promise.all(
    req.files.images.map( async(file, i) => {

      const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${filename}`);
      
      req.body.images.push(filename);
  }));
    
  next(); 
});

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
