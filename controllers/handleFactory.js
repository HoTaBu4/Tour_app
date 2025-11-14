import AppError from '../utils/AppError.js';
import CatchAsync from "../utils/catchAsync.js";
import APIFeatures from '../utils/apiFeatures.js';

const deleteOne = Model => CatchAsync(async(req, res ,next) => {
  const doc = await Model.findByIdAndDelete(req.params.id);

  if (!doc) {
    return next(new AppError('Failed to delete document with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
})

const updateOne = Model => CatchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!doc) {
        return next(new AppError('Failed to get document with that ID', 404));
    }
    
    res.status(200).json({
    status: 'success',
    data: {
        data: doc
    }
    });
});

const createOne = Model => CatchAsync(async (req, res, next) => {
   const newTour = await Model.create(req.body);
   res.status(201).json({
     status: "success",
     data: {
       data: newTour
     }
   });
});

const getOne = (Model, popOption) => CatchAsync(async(req, res, next) => {
  let query = await Model.findById(req.params.id)

  if (popOption) {
    query = query.populate('reviews');
  }

  const doc = await query

  if (!doc) {
      return next(new AppError('Failed to get document with that ID', 404));
   }

  // Tour.findOne({ _id: req.params.id });
  res.status(200).json({ status: "success", data: { data:doc } });
})

export const getAll = Model => CatchAsync(async (req, res,next) => {

    //to allow for nested GET reviews on tour
    let filter = {}

    if (req.params.tourId) {
        filter = { tour: req.params.tourId }
    }

  // Execute query
  const Feature = new APIFeatures(Model.find(filter),req.query)
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

export default {createOne, updateOne ,deleteOne, getOne, getAll}