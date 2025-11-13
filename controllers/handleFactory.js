import AppError from '../utils/AppError.js';
import CatchAsync from "../utils/catchAsync.js";

export const deleteOne = Model => CatchAsync(async(req, res ,next) => {
  const tour = await Model.findByIdAndDelete(req.params.id);

  if (!tour) {
    return next(new AppError('Failed to delete tour with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null
  });
})