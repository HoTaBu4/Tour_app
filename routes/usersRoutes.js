import express from 'express';
import { getAllUsers, createUser, getUser, deleteUser, updateMe, deleteMe, getMe, uploadUserPhoto, resizeUserPhoto } from '../controllers/userController.js';
import * as authController from '../controllers/authController.js';

const router = express.Router();

router.route("/signup")
  .post(authController.signup);
router.route("/login")
  .post(authController.login);
router.route("/logout")
  .get(authController.logout);

router.route("/forgotPassword")
  .post(authController.forgotPassword);
router.route("/resetPassword/:token")
  .patch(authController.resetPassword);
  
//protect all routes after this middleware
router.use(authController.protect);
  
router.route('/me')
  .get(getMe, getUser);

router.route("/updateMyPassword")
  .patch(authController.updatePassword);

router.route("/updateMe")
  .patch( uploadUserPhoto, resizeUserPhoto, updateMe);
router.route("/deleteMe")
  .delete(deleteMe);

//restrict all routes after this middleware
router.use(authController.restrictTo('admin'))

router.route("/")
  .get(getAllUsers)
  .post(createUser);

router.route("/:id")
  .get(getUser)
  .delete(deleteUser);

export default router ;
