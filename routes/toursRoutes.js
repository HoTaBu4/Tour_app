import express from 'express';
import { getAllTours, createTour, getTour, deleteTour, updateTour ,getTourStats, getMonthlyPlan, getToursWithin, getDistances} from '../controllers/tourController.js';
import * as authController from '../controllers/authController.js';
import reviewsRouter from '../routes/reviewsRoutes.js'
const router = express.Router()

router.use('/:tourId/reviews',reviewsRouter)

router.route('/tour-stats')
  .get(getTourStats)

router.route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide','guide'),
    getMonthlyPlan
  )

router.route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(getToursWithin)

router.route('/distances/:latlng/unit/:unit')
  .get(authController.protect, getDistances)

router.route("/")
  .get(getAllTours )
  .post( 
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    createTour
  );

router.route("/:id")
  .get(getTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    deleteTour
  )
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    updateTour
  );

export default router;
