import { useAuth } from "../contexts/AuthContext";
import AccessDenied from "../components/AccessDenied";

export default function CashierPage() {
  const { user } = useAuth();
  if (!user || (user.role !== "Manager" && user.role !== "Cashier"))
    return <AccessDenied />;
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Cashier POS Terminal</h1>
      <div className="mt-8 p-8 border rounded-lg bg-gray-50">
        <h2 className="text-xl font-semibold">Point of Sale Interface</h2>
      </div>
    </div>
  );
}
