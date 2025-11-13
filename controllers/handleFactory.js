import AppError from '../utils/AppError.js';
import CatchAsync from "../utils/catchAsync.js";

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

export default {createOne, updateOne ,deleteOne}