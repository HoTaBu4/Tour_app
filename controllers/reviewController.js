import Review from "../models/reviewModel.js";
// import CatchAsync from "../utils/catchAsync.js";
import handleFactory from "./handleFactory.js";


export const setTourUserIds = (req, res, next) => {
    if (!req.body.tour) {
        req.body.tour = req.params.tourId
    }
    
    if (!req.body.user) {
        req.body.user = req.user.id
    }
    
    next()
}

export const getAllReviews = handleFactory.getAll(Review);
export const createReview = handleFactory.createOne(Review)
export const getReview = handleFactory.getOne(Review);
export const updateReview = handleFactory.updateOne(Review);
export const deleteReview = handleFactory.deleteOne(Review);
