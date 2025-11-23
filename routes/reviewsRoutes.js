import express from 'express';
import { createReview, deleteReview, getAllReviews, getReview, setTourUserIds, updateReview } from '../controllers/reviewController.js';
import * as authController from '../controllers/authController.js';

const router = express.Router({mergeParams: true});

router.use(authController.protect);

router.route("/")
    .get(getAllReviews)
    .post(
        authController.restrictTo('user'),
        setTourUserIds,
        createReview
    );

router.route("/:id")
    .get(getReview)
    .patch(authController.restrictTo('user','admin'), updateReview)
    .delete(authController.restrictTo('user'), deleteReview)

export default router;
