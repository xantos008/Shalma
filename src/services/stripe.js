import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-toastify";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);


export const redirectToStripeCheckout = async (sessionId) => {
    const stripe = await stripePromise;
    const result = await stripe.redirectToCheckout({
        sessionId,
    });
    if (result.error) {
        return toast.error("Something went wrong with redirection");
    }
}