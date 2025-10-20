import express from 'express';
import { getAllTours, createTour, getTour, deleteTour, updateTour ,getTourStats} from '../controllers/tourController.js';

const router = express.Router()

router.route('/tour-stats')
  .get(getTourStats)

router.route("/")
  .get(getAllTours)
  .post( createTour);

router.route("/:id")
  .get(getTour)
  .delete(deleteTour)
  .patch(updateTour);

export default router;