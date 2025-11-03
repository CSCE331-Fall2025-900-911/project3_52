import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import AccessDenied from "../../components/AccessDenied";
import { IconBox, IconList, IconUsers, IconReceipt } from "../../components/Icons";

// Import the sub-pages
import ProductManager from "./ProductManager";
import StaffManager from "./StaffManager";
import InventoryManager from "./InventoryManager";
import OrderHistory from "./OrderHistory"; // Assuming you have this component

export default function ManagerPage() {
  const { user } = useAuth();
  const [view, setView] = useState<
    "products" | "staff" | "inventory" | "orders"
  >(() => localStorage.getItem("momtea.managerView") as
    | "products"
    | "staff"
    | "inventory"
    | "orders"
    || "products"
  );

  React.useEffect(() => {
    localStorage.setItem("momtea.managerView", view);
  }, [view]);

  // Access check
  if (!user || user.role !== "Manager") {
    return <AccessDenied />;
  }

  const renderView = () => {
    switch (view) {
      case "products":
        return <ProductManager />;
      case "staff":
        return <StaffManager />;
      case "inventory":
        return <InventoryManager />;
      case "orders":
        return <OrderHistory />;
      default:
        return <ProductManager />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <nav className="w-64 bg-white shadow-md p-6">
        <h2 className="text-2xl font-bold mb-8">Manager Portal</h2>
        <ul className="space-y-3">
          <ManagerNavLink
            icon={<IconBox />}
            label="Products"
            onClick={() => setView("products")}
            active={view === "products"}
          />
          <ManagerNavLink
            icon={<IconUsers />}
            label="Staff"
            onClick={() => setView("staff")}
            active={view === "staff"}
          />
          <ManagerNavLink
            icon={<IconList />}
            label="Inventory"
            onClick={() => setView("inventory")}
            active={view === "inventory"}
          />
          <ManagerNavLink
            icon={<IconReceipt />}
            label="Orders"
            onClick={() => setView("orders")}
            active={view === "orders"}
          />
        </ul>
      </nav>
      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">{renderView()}</main>
    </div>
  );
}

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