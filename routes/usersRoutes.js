import express from 'express';
import { getAllUsers, createUser, getUser, deleteUser, updateMe, deleteMe, getMe } from '../controllers/userController.js';
import { forgotPassword, login, protect, resetPassword, restrictTo, signup, updatePassword } from '../controllers/authController.js';

const router = express.Router();

router.route("/signup")
  .post(signup);
router.route("/login")
  .post(login);

router.route("/forgotPassword")
  .post(forgotPassword);
router.route("/resetPassword/:token")
  .patch(resetPassword);
  
//protect all routes after this middleware
router.use(protect);
  
router.route('/me')
  .get(getMe, getUser);

router.route("/updateMyPassword")
  .patch(updatePassword);

router.route("/updateMe")
  .patch(updateMe);
router.route("/deleteMe")
  .delete(deleteMe);

//restrict all routes after this middleware
router.use(restrictTo('admin'))

router.route("/")
  .get(getAllUsers)
  .post(createUser);

router.route("/:id")
  .get(getUser)
  .delete(deleteUser);

export default router ;
