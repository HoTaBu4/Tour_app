import express from 'express';
import { getAllTours, createTour, getTour, deleteTour, updateTour,checkForDataTour} from '../controllers/tourController.js';

const router = express.Router()

router.route("/")
  .get(getAllTours)
  .post(checkForDataTour, createTour);

router.route("/:id")
  .get(getTour)
  .delete(deleteTour)
  .patch(updateTour);

export default router;