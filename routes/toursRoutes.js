import express from 'express';
import { getAllTours, createTour, getTour, deleteTour, updateTour ,getTourStats, getMonthlyPlan} from '../controllers/tourController.js';
import { protect,restrictTo } from '../controllers/authController.js';

const router = express.Router()

router.route('/tour-stats')
  .get(getTourStats)

router.route('/monthly-plan/:year')
  .get(getMonthlyPlan)

router.route("/")
  .get( protect, getAllTours )
  .post( createTour);

router.route("/:id")
  .get(getTour)
  .delete(
    protect,
    restrictTo('admin'),
    deleteTour
  )
  .patch(updateTour);

export default router;