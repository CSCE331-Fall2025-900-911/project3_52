import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import AccessDenied from "../../components/AccessDenied";
import {
  IconBox,
  IconList,
  IconUsers,
  IconReceipt,
  IconReport,
  IconDashboard, // ← NEW
} from "../../components/Icons";

// Import the sub-pages
import ProductManager from "./ProductManager";
import StaffManager from "./StaffManager";
import InventoryManager from "./InventoryManager";
import OrderHistory from "./OrderHistory";
import ReportsManager from "./ReportsManager";
import AnalyticsDashboard from "./AnalyticsDashboard"; // ← NEW

export default function ManagerPage() {
  const { user } = useAuth();
  const [view, setView] = useState<
    "analytics" | "products" | "staff" | "inventory" | "orders" | "reports"
  >(
    () => (localStorage.getItem("momtea.managerView") as any) || "analytics" // ← default to analytics
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  React.useEffect(() => {
    localStorage.setItem("momtea.managerView", view);
  }, [view]);

  // Access check
  if (!user || user.role !== "Manager") {
    return <AccessDenied />;
  }

  const renderView = () => {
    switch (view) {
      case "analytics":
        return <AnalyticsDashboard />;
      case "products":
        return <ProductManager />;
      case "staff":
        return <StaffManager />;
      case "inventory":
        return <InventoryManager />;
      case "orders":
        return <OrderHistory />;
      case "reports":
        return <ReportsManager />;
      default:
        return <AnalyticsDashboard />;
    }
  };

  return (
    <div className="flex flex-col sm:flex-row h-screen bg-gray-100">
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/30 sm:hidden z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      <nav
        className={`${
          isMenuOpen ? "block" : "hidden"
        } sm:block fixed left-0 top-20 w-64 bg-white shadow-md flex flex-col h-full overflow-y-auto z-50`}
      >
        {/* Sticky header inside sidebar */}
        <div className="p-6 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold">Manager Portal</h2>
        </div>

        {/* Sidebar navigation section */}
        <ul className="flex-1 p-6 space-y-3">
          <ManagerNavLink
            icon={<IconDashboard />}
            label="Analytics"
            onClick={() => {
              setView("analytics");
              setIsMenuOpen(false);
            }}
            active={view === "analytics"}
          />

          <ManagerNavLink
            icon={<IconReport />}
            label="X/Z Reports"
            onClick={() => {
              setView("reports");
              setIsMenuOpen(false);
            }}
            active={view === "reports"}
          />
          <ManagerNavLink
            icon={<IconBox />}
            label="Products"
            onClick={() => {
              setView("products");
              setIsMenuOpen(false);
            }}
            active={view === "products"}
          />
          <ManagerNavLink
            icon={<IconUsers />}
            label="Staff"
            onClick={() => {
              setView("staff");
              setIsMenuOpen(false);
            }}
            active={view === "staff"}
          />
          <ManagerNavLink
            icon={<IconList />}
            label="Inventory"
            onClick={() => {
              setView("inventory");
              setIsMenuOpen(false);
            }}
            active={view === "inventory"}
          />

          <ManagerNavLink
            icon={<IconReceipt />}
            label="Orders"
            onClick={() => {
              setView("orders");
              setIsMenuOpen(false);
            }}
            active={view === "orders"}
          />
        </ul>
      </nav>

      {/* Mobile Header */}
      <header className="sm:hidden flex items-center justify-between bg-white shadow-md p-4">
        <h2 className="text-xl font-bold">Manager Portal</h2>
        <button
          className="text-gray-600 hover:text-gray-900 text-2xl"
          onClick={() => setIsMenuOpen(true)}
        >
          ≡
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-8 overflow-x-auto overflow-y-auto mt-4 sm:mt-0 sm:ml-64">
        {renderView()}
      </main>
    </div>
  );
}

// ManagerNavLink stays exactly the same
const ManagerNavLink = ({
  icon,
  label,
  onClick,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  active: boolean;
}) => (
  <li>
    <button
      onClick={onClick}
      className={`flex items-center gap-3 w-full p-3 rounded-lg text-lg ${
        active
          ? "bg-maroon text-white shadow-lg"
          : "text-gray-700 hover:bg-gray-200"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  </li>
);
