import User from '../models/userModel.js';
import AppError from '../utils/AppError.js';
import CatchAsync from '../utils/catchAsync.js';
import handleFactory from './handleFactory.js';

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
}


export const updateMe = CatchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }
  
  //2) Filtered out unwanted fields names that are not allowed to be updated
  const filterbody = filterObj(req.body, 'name', 'email');
  
  //3) update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filterbody, {
    new: true,
    runValidators: true
  });
  
  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser
    }
  });
})

export const deleteMe = CatchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  
  res.status(204).json({
    status: "success",
    data: null
  });
});

export const createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not yet defined!"
  });
}

export const getAllUsers = handleFactory.getAll(User);
export const deleteUser = handleFactory.deleteOne(User);

//do not update passwords
export const updateUser = handleFactory.updateOne(User);
export const getUser = handleFactory.getOne(User)
