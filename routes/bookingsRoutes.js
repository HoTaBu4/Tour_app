import express from 'express';
import { protect } from '../controllers/authController.js';
import bookingController from '../controllers/bookingController.js';

const router = express.Router();

router.get('/checkout-session/:tourId', protect, bookingController.getCheckoutSession);
  
router.get('/create-booking', bookingController.createBookingCheckout);

router.use(protect);

router
  .route('/')
  .get(bookingController.getAllBookings)
  .post(bookingController.createBooking);

router
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBooking)
  .delete(bookingController.deleteBooking);

export default router;
