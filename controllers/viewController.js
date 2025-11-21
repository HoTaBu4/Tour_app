import Tour from '../models/tourModel.js'
import CatchAsync from '../utils/catchAsync.js'
import AppError from '../utils/AppError.js'

const getOverview = CatchAsync(async (req, res,) => {
  //get tours
  const tours = await Tour.find()

  res.status(200).render('overview', {
    title: 'tours',
    tours
  })
})

const getTour = CatchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user'
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404));
  }

  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
    mapToken: process.env.MAP_TOKEN
  });
})
export default { getOverview, getTour }
