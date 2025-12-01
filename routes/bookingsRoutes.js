import express from 'express';
import { protect } from '../controllers/authController.js';
import bookingController from '../controllers/bookingController.js';

const router = express.Router();

router.get('/checkout-session/:tourId', protect, bookingController.getCheckoutSession);
  
export default router;
