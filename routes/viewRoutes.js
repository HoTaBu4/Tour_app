import express from 'express'
import viewController from '../controllers/viewController.js';
import { isLoggedIn } from '../controllers/authController.js';

const router = express.Router();

router.use(isLoggedIn)

router.get('/', viewController.getOverview)
router.get('/tour/:slug', viewController.getTour)
router.get('/login', viewController.getloginForm)

export default router;