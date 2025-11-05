import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { apiFetch } from "../api/http";

export default function PayPalCheckout({
  total,
  onSuccess,
}: {
  total: number;
  onSuccess: () => void;
}) {
  return (
    <PayPalScriptProvider
      options={{
        clientId:
          "AdLbEvgPF4eH8Mn35t3qgFpdXys7DkFDzdEdsTF2PMg4ItAOzkx0M7tKziIXqbWe-tqCBRfakRk52mzC",
      }}
    >
      <PayPalButtons
        style={{ layout: "vertical" }}
        createOrder={async () => {
          const res = await apiFetch("/api/paypal/create-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: total.toFixed(2) }),
          });
          const data = await res.json();
          return data.id; // PayPal order ID
        }}
        onApprove={async (data) => {
          const res = await apiFetch(
            `/api/paypal/capture-order/${data.orderID}`,
            {
              method: "POST",
            }
          );
          const result = await res.json();
          if (result.status === "COMPLETED") {
            alert("Payment successful!");
            onSuccess();
          } else {
            alert("Payment not completed.");
          }
        }}
      />
    </PayPalScriptProvider>
  );
}
