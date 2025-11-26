import multer from 'multer';
import User from '../models/userModel.js';
import AppError from '../utils/AppError.js';
import CatchAsync from '../utils/catchAsync.js';
import handleFactory from './handleFactory.js';
import sharp from 'sharp';

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   }
// });

//it wiil store image as buffer in memory
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

export const uploadUserPhoto = upload.single('photo');

export const resizeUserPhoto = (req, res, next) => {
  if (!req.file) {
    return next();
  }

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);
    
  next(); 
}

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

  if (req.file) {
    console.log(req.file);
    filterbody.photo = req.file.filename;
  }
  
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

export const getMe = (req, res ,next) => {
  req.params.id = req.user.id;
  next();
}

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
