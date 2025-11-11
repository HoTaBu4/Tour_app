import Review from "../models/reviewModel.js";
import CatchAsync from "../utils/catchAsync.js";

export const getAllReviews = CatchAsync(async (req, res) => {
    const reviews = await Review.find();
    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: {
            reviews
        }
    });
});

export const createReview = CatchAsync(async (req, res) => {
    const newReview = await Review.create(req.body);
    res.status(201).json({
        status: 'success',
        data: {
            review: newReview
        }
    });
});

export const getReviewById = CatchAsync(async (req, res, next) => {
    const review = await Review.findByid(req.params.id);

    if (!review) {
        return next(new AppError('No review found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            review
        }
    });
})

export const deleteReview = CatchAsync(async (req, res, next) => {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
        return next(new AppError('No review found with that ID', 404));
    }

    res.status(204).json({
        status: 'success',
        data: null
    });
})