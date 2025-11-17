import express from 'express';
import { getAllTours, createTour, getTour, deleteTour, updateTour ,getTourStats, getMonthlyPlan, getToursWithin} from '../controllers/tourController.js';
import { protect,restrictTo } from '../controllers/authController.js';
import reviewsRouter from '../routes/reviewsRoutes.js'
const router = express.Router()

router.use('/:tourId/reviews',reviewsRouter)

router.route('/tour-stats')
  .get(getTourStats)

router.route('/monthly-plan/:year')
  .get(
    protect,
    restrictTo('admin', 'lead-guide','guide'),
    getMonthlyPlan
  )

router.route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(getToursWithin)

router.route("/")
  .get(getAllTours )
  .post( 
    protect,
    restrictTo('admin', 'lead-guide'),
    createTour
  );

router.route("/:id")
  .get(getTour)
  .delete(
    protect,
    restrictTo('admin'),
    deleteTour
  )
  .patch(
    protect,
    restrictTo('admin', 'lead-guide'),
    updateTour
  );

export default router;