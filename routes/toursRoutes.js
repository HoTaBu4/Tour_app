import express from 'express';
import { getAllTours, createTour, getTour, deleteTour, updateTour, checkID,checkForDataTour} from '../controllers/tourController.js';

const router = express.Router()

router.param('id', checkID);

router.route("/")
  .get(getAllTours)
  .post(checkForDataTour, createTour);

router.route("/:id")
  .get(getTour)
  .delete(deleteTour)
  .patch(updateTour);

export default router;