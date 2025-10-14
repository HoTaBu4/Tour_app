import express from 'express';
import { getAllUsers, createUser, getUser, deleteUser } from '../controllers/userController.js';

const router = express.Router();

router.route("/")
  .get(getAllUsers)
  .post(createUser);

router.route("/:id")
  .get(getUser)
  .delete(deleteUser);

export default router ;
