import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import AccessDenied from "../../components/AccessDenied";
import {
  IconBox,
  IconList,
  IconUsers,
  IconReceipt,
} from "../../components/Icons";

// Import the sub-pages
import ProductManager from "./ProductManager";
import StaffManager from "./StaffManager";
import InventoryManager from "./InventoryManager";
import OrderHistory from "./OrderHistory"; // Assuming you have this component

export default function ManagerPage() {
  const { user } = useAuth();
  const [view, setView] = useState<
    "products" | "staff" | "inventory" | "orders"
  >(
    () =>
      (localStorage.getItem("momtea.managerView") as
        | "products"
        | "staff"
        | "inventory"
        | "orders") || "products"
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
    <div className="flex flex-col sm:flex-row h-screen bg-gray-100">
      {/* Sidebar / Mobile Menu */}
      <nav
        className={`${
          isMenuOpen ? "block" : "hidden"
        } sm:block fixed sm:static top-0 left-0 w-64 sm:w-64 h-full sm:h-auto bg-white shadow-md p-6 z-50 transition-transform`}
      >
        <div className="flex justify-between items-center mb-6 sm:mb-8">
          <h2 className="text-2xl font-bold">Manager Portal</h2>
          <button
            className="sm:hidden text-gray-600 hover:text-gray-900 text-2xl"
            onClick={() => setIsMenuOpen(false)}
          >
            &times;
          </button>
        </div>
        <ul className="space-y-3">
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
          ☰
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto mt-16 sm:mt-0">
        {renderView()}
      </main>
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
