import Tour from '../models/tourModel.js'
import CatchAsync from '../utils/catchAsync.js'
import AppError from '../utils/AppError.js'
import Booking from '../models/bookingModel.js'

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

const getMyTours = CatchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id });

  const tourIDs = bookings.map(el => el.tour);

  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render('overview', {
    title: 'My Tours',
    tours
  });
});

const getloginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'log into your account'
  })
}

const getRegisterForm = (req, res) => {
  res.status(200).render('register', {
    title: 'register your account'
  })
}

const getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account'
  })
}

export default { getOverview, getTour , getloginForm, getAccount ,getMyTours, getRegisterForm};
