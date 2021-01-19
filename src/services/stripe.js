import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-toastify";


export const redirectToStripeCheckout = async (sessionId, stripePublishKey) => {
    const stripe = await loadStripe(stripePublishKey);
    const result = await stripe.redirectToCheckout({
        sessionId,
    });
    if (result.error) {
        return toast.error("Something went wrong with redirection");
    }
}