import express from 'express'
import viewController from '../controllers/viewController.js';
import * as authController from '../controllers/authController.js';
import bookingController from '../controllers/bookingController.js';

const router = express.Router();

router.get('/',bookingController.createBookingCheckout, authController.isLoggedIn, viewController.getOverview)
router.get('/tour/:slug',authController.isLoggedIn, viewController.getTour)
router.get('/login',authController.isLoggedIn, viewController.getloginForm)
router.get('/register',authController.isLoggedIn, viewController.getRegisterForm)
router.get('/me', authController.protect , viewController.getAccount)
router.get('/my-tours', authController.protect ,viewController.getMyTours);
export default router;
