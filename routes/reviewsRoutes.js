import express from 'express';
import { createReview, deleteReview, getAllReviews, getReviewById } from '../controllers/reviewController.js';
import { protect, restrictTo } from '../controllers/authController.js';

const router = express.Router({mergeParams: true});

router.route("/")
    .get(getAllReviews)
    .post(
        protect,
        restrictTo('user'),
        createReview
    );

router.route("/:id")
    .get(getReviewById)
    .delete(protect, restrictTo('user'), deleteReview)

export default router;