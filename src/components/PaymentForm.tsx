import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { apiFetch } from "../api/http";

export default function PaymentForm({
  total,
  onSuccess,
  isDarkMode = false,
}: {
  total: number;
  onSuccess: () => void;
  isDarkMode?: boolean;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);

    try {
      // 1️⃣ Create PaymentIntent via backend
      const res = await apiFetch("/api/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: Math.round(total * 100) }),
      });

      if (!res.ok) {
        // handle HTTP errors before trying to parse JSON
        const err = await res.text();
        throw new Error(`Payment initialization failed: ${err}`);
      }

      const { clientSecret } = await res.json();
      if (!clientSecret) throw new Error("Missing clientSecret in response");

      // 2️⃣ Confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement)! },
      });

      if (result.error) {
        toast.error(result.error.message || "Payment failed");
      } else if (result.paymentIntent?.status === "succeeded") {
        toast.success("Payment successful via Card!");
        onSuccess(); // proceed to order creation
      } else {
        toast("Payment not completed. Please try again.", {
          icon: "⚠️",
        });
      }
    } catch (err: any) {
      toast.error(err.message || "Unexpected error during payment.");
      console.error("Payment error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handlePayment} className="space-y-4 dark:text-white dark:bg-gray-800 p-4 rounded-md">
      <CardElement className="p-3 border rounded-md bg-white dark:bg-gray-400 dark:text-white" />
      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full py-3 bg-maroon text-white font-bold rounded-lg hover:bg-darkmaroon disabled:opacity-50"
      >
        {loading ? "Processing..." : `Pay $${total.toFixed(2)}`}
      </button>
    </form>
  );
}
