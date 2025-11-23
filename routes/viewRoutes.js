import express from 'express'
import viewController from '../controllers/viewController.js';
import * as authController from '../controllers/authController.js';

const router = express.Router();

router.use(authController.isLoggedIn)

router.get('/', viewController.getOverview)
router.get('/tour/:slug', viewController.getTour)
router.get('/login', viewController.getloginForm)

export default router;
