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
  const [sortField, setSortField] = useState<"order_id" | "total_price" | null>(
    null
  );
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // --- State for modal ---
  const [selectedOrder, setSelectedOrder] = useState<OrderHistoryRecord | null>(
    null
  );

  // --- State for search query ---
  const [searchQuery, setSearchQuery] = useState("");

  // --- State for pagination ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;
  const [totalCount, setTotalCount] = useState(0);
  const totalPages = Math.max(1, Math.ceil(totalCount / itemsPerPage));

  // --- State for page input ---
  const [pageInput, setPageInput] = useState(currentPage);

  // --- State for editing page number inline ---
  const handleSort = (field: "order_id" | "total_price") => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };
  // --- Data Fetching ---
  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiFetch(
        `/api/orders?limit=${itemsPerPage}&offset=${
          (currentPage - 1) * itemsPerPage
        }`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch order history.");
      }
      const result = await response.json();
      console.log("Fetched orders result:", result);
      const ordersData = result?.orders ?? result;
      const orders: OrderHistoryRecord[] = Array.isArray(ordersData)
        ? ordersData
        : [];

      orders.sort((a, b) => Number(b.order_id) - Number(a.order_id));

      setOrders(orders);
      setTotalCount(result.count ?? 0);
      console.log("Fetched orders count:", orders.length);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage]);

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

  // --- Page jump handler ---
  const handlePageJump = () => {
    const pageNum = Number(pageInput);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    } else {
      setPageInput(currentPage);
    }
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

    // Filter orders based on searchQuery (case-insensitive)
    const filteredOrders = orders.filter((order) => {
      const query = searchQuery.toLowerCase();
      const orderIdStr = String(order.order_id).toLowerCase();
      const paymentMethodStr = order.payment_method.toLowerCase();
      return orderIdStr.includes(query) || paymentMethodStr.includes(query);
    });

    const paginatedOrders = filteredOrders;

    return (
      <div>
        <div className="mb-4">
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-maroon"
            placeholder="Search by Order ID or Payment Method..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  onClick={() => handleSort("order_id")}
                  className="p-4 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer select-none"
                >
                  <div className="flex items-center justify-between">
                    <span>Order ID</span>
                    <span className="inline-block w-3 text-center">
                      {sortField === "order_id"
                        ? sortOrder === "asc"
                          ? "▲"
                          : "▼"
                        : ""}
                    </span>
                  </div>
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

                <th
                  onClick={() => handleSort("total_price")}
                  className="p-4 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer select-none"
                >
                  <div className="flex items-center justify-between">
                    <span>Total Price</span>
                    <span className="inline-block w-3 text-center">
                      {sortField === "total_price"
                        ? sortOrder === "asc"
                          ? "▲"
                          : "▼"
                        : ""}
                    </span>
                  </div>
                </th>

                <th className="p-4 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedOrders
                .sort((a, b) => {
                  if (!sortField) return 0;

                  const parseId = (id: string | number) => {
                    const str = String(id);
                    const num = parseInt(str.replace(/\D/g, ""), 10);
                    return isNaN(num) ? 0 : num;
                  };

                  let valA: number, valB: number;

                  if (sortField === "order_id") {
                    valA = parseId(a.order_id);
                    valB = parseId(b.order_id);
                  } else {
                    valA = a.total_price ?? 0;
                    valB = b.total_price ?? 0;
                  }

                  return sortOrder === "asc" ? valA - valB : valB - valA;
                })
                .map((order) => (
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
          <div className="flex justify-between items-center p-4 bg-gray-50">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-gray-200 text-gray-800 rounded disabled:opacity-50 hover:bg-gray-300"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page{" "}
              <input
                type="number"
                min={1}
                max={totalPages}
                value={pageInput}
                onChange={(e) => setPageInput(Number(e.target.value))}
                onBlur={handlePageJump}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handlePageJump();
                  }
                }}
                className="w-16 p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-maroon text-center"
                autoFocus
              />{" "}
              of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-gray-200 text-gray-800 rounded disabled:opacity-50 hover:bg-gray-300"
            >
              Next
            </button>
          </div>
        </div>
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
