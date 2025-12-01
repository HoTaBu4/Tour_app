import Tour from "../models/tourModel.js";
import CatchAsync from "../utils/catchAsync.js";
import stripe from "stripe";
import dotenv from 'dotenv';
dotenv.config({ path: './config.env' });

const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

const getCheckoutSession = CatchAsync(async (req, res, next) => {
  // 1) Get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);
  
  //create checkout session
  const session = await stripeInstance.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    success_url: `${req.protocol}://${req.get('host')}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: Math.round(tour.price * 100),
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [`${req.protocol}://${req.get('host')}/img/tours/${tour.imageCover}`]
          }
        }
      }
    ]
  });

  res.status(200).json({
    status: 'success',
    session
  });
});

export default { getCheckoutSession };
