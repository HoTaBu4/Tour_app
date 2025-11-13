import Review from "../models/reviewModel.js";
import CatchAsync from "../utils/catchAsync.js";
import handleFactory from "./handleFactory.js";

export const getAllReviews = CatchAsync(async (req, res) => {
    let filter = {}

    if (req.params.tourId) {
        filter = { tour: req.params.tourId }
    }

    const reviews = await Review.find( filter );
    res.status(200).json({
        status: 'success',
        results: reviews.length,
        data: {
            reviews
        }
    });
});

export const setTourUserIds = (req, res, next) => {
    if (!req.body.tour) {
        req.body.tour = req.params.tourId
    }

    if (!req.body.user) {
        req.body.user = req.user.id
    }

    next()
}

export const createReview = handleFactory.createOne(Review)

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

export const updateReview = handleFactory.updateOne(Review);
export const deleteReview = handleFactory.deleteOne(Review);
