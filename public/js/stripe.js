import axios from "axios";
const stripe = Stripe('pk_test_51SYVVULBpL5tF0drBeBFuUweT7XYehkX4YFzsUq1DQzQFLTDs0sZXZWcZ76OmpTmBUXlGR5mlkHPz1iI0bbS3B0t00mznS2ZdK');

export const bookTour = async (tourId) => {
  try {

    // 1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`); 
  
    console.log(session);
    // 2) Create checkout form + charge credit card

    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });

  } catch (err) {
    console.log(err);
  }
}