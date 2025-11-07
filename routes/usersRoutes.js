import express from 'express';
import { getAllUsers, createUser, getUser, deleteUser, updateMe, deleteMe } from '../controllers/userController.js';
import { forgotPassword, login, protect, resetPassword, signup, updatePassword } from '../controllers/authController.js';

const router = express.Router();

router.route("/signup")
  .post(signup);
router.route("/login")
  .post(login);

router.route("/forgotPassword")
  .post(forgotPassword);
router.route("/resetPassword/:token")
  .patch(resetPassword);

router.route("/updateMe")
  .patch(protect, updateMe);
router.route("/deleteMe")
  .delete(protect, deleteMe);

router.route("/updateMyPassword")
  .patch(protect, updatePassword);

router.route("/")
  .get(getAllUsers)
  .post(createUser);

router.route("/:id")
  .get(getUser)
  .delete(deleteUser);

export default router ;
