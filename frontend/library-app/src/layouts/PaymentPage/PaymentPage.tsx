import { useAuth0 } from "@auth0/auth0-react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PaymentInfoRequest from "../../models/PaymentInfoRequest";
import { SpinnerLoading } from "../Utils/SpinnerLoading";

export const PaymentPage = () => {
    const { isAuthenticated, isLoading, user, getAccessTokenSilently } = useAuth0();
    const [httpError, setHttpError] = useState<string | boolean>(false);
    const [submitDisabled, setSubmitDisabled] = useState(false);
    const [fees, setFees] = useState(0);
    const [loadingFees, setLoadingFees] = useState(true);

    const elements = useElements();
    const stripe = useStripe();

    // Fetch fees when logged in
    useEffect(() => {
        const fetchFees = async () => {
            if (!isAuthenticated) return;

            try {
                const token = await getAccessTokenSilently();
                const email = user?.email; // user email from Auth0 profile

                const url = `${process.env.REACT_APP_API}/payments/search/findByUserEmail?userEmail=${email}`;
                const requestOptions = {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                };

                const paymentResponse = await fetch(url, requestOptions);
                if (!paymentResponse.ok) {
                    throw new Error("Something went wrong!");
                }
                const paymentResponseJson = await paymentResponse.json();
                setFees(paymentResponseJson.amount);
            } catch (error: any) {
                setHttpError(error.message);
            } finally {
                setLoadingFees(false);
            }
        };

        fetchFees();
    }, [isAuthenticated, getAccessTokenSilently, user]);

    // Stripe checkout
    async function checkout() {
        if (!stripe || !elements || !elements.getElement(CardElement)) {
            return;
        }

        setSubmitDisabled(true);

        try {
            const token = await getAccessTokenSilently();
            const email = user?.email;

            let paymentInfo = new PaymentInfoRequest(Math.round(fees * 100), "USD", email);

            // 1️⃣ Create payment intent
            const createIntentUrl = `https://localhost:8443/api/payment/secure/payment-intent`;
            const createIntentOptions = {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(paymentInfo),
            };

            const stripeResponse = await fetch(createIntentUrl, createIntentOptions);
            if (!stripeResponse.ok) throw new Error("Something went wrong!");
            const stripeResponseJson = await stripeResponse.json();

            // 2️⃣ Confirm card payment
            const result = await stripe.confirmCardPayment(stripeResponseJson.client_secret, {
                payment_method: {
                    card: elements.getElement(CardElement)!,
                    billing_details: { email },
                },
            });

            if (result.error) {
                alert("There was an error");
                setSubmitDisabled(false);
                return;
            }

            // 3️⃣ Mark payment complete
            const completeUrl = `https://localhost:8443/api/payment/secure/payment-complete`;
            const completeOptions = {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            };

            const completeResponse = await fetch(completeUrl, completeOptions);
            if (!completeResponse.ok) throw new Error("Something went wrong!");

            setFees(0);
            setHttpError(false);
        } catch (error: any) {
            setHttpError(error.message);
        } finally {
            setSubmitDisabled(false);
        }
    }

    // Loading and error handling
    if (isLoading || loadingFees) {
        return <SpinnerLoading />;
    }

    if (httpError) {
        return (
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        );
    }

    return (
        <div className="container">
            {fees > 0 && (
                <div className="card mt-3">
                    <h5 className="card-header">
                        Fees pending: <span className="text-danger">${fees}</span>
                    </h5>
                    <div className="card-body">
                        <h5 className="card-title mb-3">Credit Card</h5>
                        <CardElement id="card-element" />
                        <button
                            disabled={submitDisabled}
                            type="button"
                            className="btn btn-md main-color text-white mt-3"
                            onClick={checkout}
                        >
                            Pay fees
                        </button>
                    </div>
                </div>
            )}

            {fees === 0 && (
                <div className="mt-3">
                    <h5>You have no fees!</h5>
                    <Link type="button" className="btn main-color text-white" to="search">
                        Explore top books
                    </Link>
                </div>
            )}
            {submitDisabled && <SpinnerLoading />}
        </div>
    );
};
