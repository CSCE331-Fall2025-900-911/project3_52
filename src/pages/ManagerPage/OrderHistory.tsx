import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../../api/http";
import { OrderHistoryRecord } from "../../types/models";
import Modal from "../../components/Modal";
import Spinner from "../../components/Spinner";

/**
 * A modal component to display the items in a specific order.
 */
const OrderDetailsModal = ({
  order,
  onClose,
}: {
  order: OrderHistoryRecord;
  onClose: () => void;
}) => {
  // --- State for the order's specific items ---
  const [items, setItems] = useState<any[]>([]); // Using 'any' as OrderItem doesn't include product name
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Fetch order details (the items) ---
  useEffect(() => {
    const fetchOrderItems = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // We need an endpoint to get items for a *specific* order
        // This assumes your API has: GET /api/orders/<order_id>
        const response = await apiFetch(`/api/orders/${order.order_id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch order details.");
        }
        const data = await response.json();
        // Assuming the API returns an object with an 'items' array
        setItems(data.items || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderItems();
  }, [order.order_id]);

  // --- Render modal content ---
  const renderContent = () => {
    if (isLoading) return <Spinner />;
    if (error) return <p className="text-red-500">{error}</p>;
    if (items.length === 0) return <p>This order has no items.</p>;

    return (
      <ul className="divide-y divide-gray-200">
        {items.map((item, index) => (
          <li
            key={item.product_id || index}
            className="py-3 flex justify-between"
          >
            <div>
              <p className="font-semibold text-gray-800">
                {/* NOTE: The OrderItem table doesn't have the product_name.
                  A good API would JOIN this table with Products.
                  We'll assume the API provides 'product_name' for this view.
                */}
                {item.product_name || `Product ID: ${item.product_id}`}
              </p>
              <p className="text-sm text-gray-500">
                Size: {item.size} | Sugar: {item.sugar_level}% | Ice:{" "}
                {item.ice_level}%
              </p>
              {item.toppings && (
                <p className="text-sm text-gray-500">
                  Toppings: {item.toppings}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="font-semibold">${item.price ?? 0}</p>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={`Order #${order.order_id} Details`}
    >
      <div className="mb-4">
        <p>
          <strong>Date:</strong> {order.month}/{order.day}/{order.year}
        </p>
        <p>
          <strong>Time:</strong> {order.time}
        </p>
        <p>
          <strong>Payment:</strong> {order.payment_method}
        </p>
        <p className="text-xl font-bold mt-2">
          Total: ${order.total_price ?? 0}
        </p>
      </div>
      <div className="max-h-64 overflow-y-auto">{renderContent()}</div>
    </Modal>
  );
};

export default function OrderHistory() {
  // --- State for data, loading, and errors ---
  const [orders, setOrders] = useState<OrderHistoryRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- State for modal ---
  const [selectedOrder, setSelectedOrder] = useState<OrderHistoryRecord | null>(
    null
  );

  // --- Data Fetching ---
  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiFetch("/api/orders");
      if (!response.ok) {
        throw new Error("Failed to fetch order history.");
      }
      const data: OrderHistoryRecord[] = await response.json();
      // Sort by most recent first
      data.sort((a, b) => b.order_id - a.order_id);
      setOrders(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // --- Modal Handlers ---
  const openDetailsModal = (order: OrderHistoryRecord) => {
    setSelectedOrder(order);
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  // --- Render Logic ---
  const renderContent = () => {
    if (isLoading) {
      return <Spinner />;
    }

    if (error) {
      return <p className="text-red-500 text-center">{error}</p>;
    }

    if (orders.length === 0) {
      return <p className="text-gray-500 text-center">No orders found.</p>;
    }

    return (
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">
                Order ID
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">
                Date
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">
                Time
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">
                Payment Method
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">
                Total Price
              </th>
              <th className="p-4 text-right text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.order_id}>
                <td className="p-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{order.order_id}
                </td>
                <td className="p-4 whitespace-nowrap text-sm text-gray-500">
                  {order.month}/{order.day}/{order.year}
                </td>
                <td className="p-4 whitespace-nowrap text-sm text-gray-500">
                  {order.time}
                </td>
                <td className="p-4 whitespace-nowrap text-sm text-gray-500">
                  {order.payment_method}
                </td>
                <td className="p-4 whitespace-nowrap text-sm text-gray-500">
                  ${order.total_price ?? 0}
                </td>
                <td className="p-4 whitespace-nowrap text-sm font-medium text-right">
                  <button
                    onClick={() => openDetailsModal(order)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Order History</h2>
        <button
          onClick={() => fetchOrders()}
          className="px-4 py-2 bg-maroon text-white rounded-lg shadow hover:bg-darkmaroon"
          disabled={isLoading}
        >
          {isLoading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {renderContent()}

      {selectedOrder && (
        <OrderDetailsModal order={selectedOrder} onClose={closeModal} />
      )}
    </div>
  );
}
