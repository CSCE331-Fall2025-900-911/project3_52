import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { apiFetch } from "../api/http";
import { Product, Staff } from "../types/models";
import Modal from "../components/Modal";
import Spinner from "../components/Spinner";
import AccessDenied from "../components/AccessDenied";
import {IconBox, IconList, IconUsers, IconReceipt } from "../components/Icons";
import { Inventory, OrderHistoryRecord } from "../types/models";

export default function ManagerPage() {
  const { user } = useAuth();
  const [view, setView] = useState<
    "products" | "staff" | "inventory" | "orders"
  >("products");

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
          ? "bg-blue-600 text-white shadow-lg"
          : "text-gray-700 hover:bg-gray-200"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  </li>
);

// --- Manager Sub-Components ---
const ProductForm = ({
  product,
  onSuccess,
  onCancel,
}: {
  product: Product | null; // null means we're creating a new product
  onSuccess: (updatedProduct: Product) => void;
  onCancel: () => void;
}) => {
  // --- Form State ---
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const isEditing = product !== null;

  // --- Effect to pre-fill form if editing ---
  useEffect(() => {
    if (isEditing) {
      setName(product.product_name);
      setPrice(String(product.price));
      setCategory(product.category);
    } else {
      // Reset form for "Add"
      setName("");
      setPrice("");
      setCategory("");
    }
  }, [product, isEditing]);

  // --- Submit Handler ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    const url = isEditing
      ? `/api/products/${product.product_id}`
      : "/api/products";
    const method = isEditing ? "PUT" : "POST";

    const payload = {
      product_name: name,
      price: parseFloat(price),
      category: category,
    };

    // Basic validation
    if (
      !payload.product_name ||
      !payload.category ||
      isNaN(payload.price) ||
      payload.price <= 0
    ) {
      setFormError("Please fill out all fields with valid data.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await apiFetch(url, {
        method: method,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to save product.");
      }

      const savedProduct: Product = await response.json();
      onSuccess(savedProduct); // Pass the new/updated product back
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Render ---
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Product Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>
      <div>
        <label
          htmlFor="price"
          className="block text-sm font-medium text-gray-700"
        >
          Price
        </label>
        <input
          type="number"
          id="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          required
          min="0"
          step="0.01"
        />
      </div>
      <div>
        <label
          htmlFor="category"
          className="block text-sm font-medium text-gray-700"
        >
          Category
        </label>
        <input
          type="text"
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>

      {formError && <p className="text-red-500 text-sm">{formError}</p>}

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save Product"}
        </button>
      </div>
    </form>
  );
};

const ProductManager = () => {
  // --- State for data, loading, and errors ---
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- State for modal ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null); // null = new, Product = editing

  // --- Data Fetching ---
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiFetch("/api/products");
      if (!response.ok) {
        throw new Error("Failed to fetch products.");
      }
      const data: Product[] = await response.json();
      setProducts(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // --- Modal Handlers ---
  const openAddModal = () => {
    setCurrentProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setCurrentProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentProduct(null);
  };

  // --- CRUD Handlers ---

  /**
   * Called by ProductForm on successful save.
   * Updates the local state to reflect the change.
   */
  const handleSaveSuccess = (savedProduct: Product) => {
    if (currentProduct) {
      // We were editing, so replace the old item
      setProducts(
        products.map((p) =>
          p.product_id === savedProduct.product_id ? savedProduct : p
        )
      );
    } else {
      // We were adding, so append the new item
      setProducts([...products, savedProduct]);
    }
    closeModal();
  };

  // --- Render Logic ---
  const renderContent = () => {
    if (isLoading) {
      return <Spinner />;
    }

    if (error) {
      return <p className="text-red-500 text-center">{error}</p>;
    }

    return (
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">
                Name
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">
                Category
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">
                Price
              </th>
              <th className="p-4 text-right text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.product_id}>
                <td className="p-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {product.product_name}
                </td>
                <td className="p-4 whitespace-nowrap text-sm text-gray-500">
                  {product.category}
                </td>
                <td className="p-4 whitespace-nowrap text-sm text-gray-500">
                  ${product.price}
                </td>
                <td className="p-4 whitespace-nowrap text-sm font-medium text-right space-x-4">
                  <button
                    onClick={() => openEditModal(product)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
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
        <h2 className="text-3xl font-bold">Product Management</h2>
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
        >
          + Add Product
        </button>
      </div>

      {renderContent()}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={currentProduct ? "Edit Product" : "Add New Product"}
      >
        <ProductForm
          product={currentProduct}
          onSuccess={handleSaveSuccess}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
};

/**
 * A reusable form for creating or editing a staff member.
 * It's rendered inside the Modal.
 */
const StaffForm = ({
  staff,
  onSuccess,
  onCancel,
}: {
  staff: Staff | null; // null means we're creating a new staff member
  onSuccess: (updatedStaff: Staff) => void;
  onCancel: () => void;
}) => {
  // --- Form State ---
  const [staffId, setStaffId] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [salary, setSalary] = useState("");
  const [hoursWorked, setHoursWorked] = useState("");
  const [email, setEmail] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const isEditing = staff !== null;

  // --- Effect to pre-fill form if editing ---
  useEffect(() => {
    if (isEditing) {
      setStaffId(staff.staff_id);
      setName(staff.name);
      setRole(staff.role);
      setSalary(String(staff.salary));
      setHoursWorked(String(staff.hours_worked));
      setEmail(staff.email);
    } else {
      // Reset form for "Add"
      setStaffId("");
      setName("");
      setRole("");
      setSalary("");
      setHoursWorked("");
      setEmail("");
    }
  }, [staff, isEditing]);

  // --- Submit Handler ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    // staff_id is the primary key and is part of the URL, not the body
    const url = isEditing ? `/api/staff/${staff.staff_id}` : "/api/staff";
    const method = isEditing ? "PUT" : "POST";

    const payload = {
      staff_id: staffId,
      name: name,
      role: role,
      salary: parseFloat(salary),
      hours_worked: parseFloat(hoursWorked),
      email: email,
    };

    // Basic validation
    if (
      !payload.staff_id ||
      !payload.name ||
      !payload.role ||
      !payload.email ||
      isNaN(payload.salary) ||
      payload.salary <= 0 ||
      isNaN(payload.hours_worked) ||
      payload.hours_worked < 0
    ) {
      setFormError("Please fill out all fields with valid data.");
      setIsSubmitting(false);
      return;
    }

    // For a PUT request, we often don't send the primary key in the body
    if (isEditing) {
      // @ts-ignore
      delete payload.staff_id; // Don't allow changing the ID
    }

    try {
      const response = await apiFetch(url, {
        method: method,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to save staff member.");
      }

      const savedStaff: Staff = await response.json();
      onSuccess(savedStaff); // Pass the new/updated staff member back
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Render ---
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="staffId"
          className="block text-sm font-medium text-gray-700"
        >
          Staff ID (Username)
        </label>
        <input
          type="text"
          id="staffId"
          value={staffId}
          onChange={(e) => setStaffId(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm disabled:bg-gray-100"
          required
          disabled={isEditing} // Can't change staff ID after creation
        />
      </div>
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Full Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>
      <div>
        <label
          htmlFor="role"
          className="block text-sm font-medium text-gray-700"
        >
          Role
        </label>
        <select
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          required
        >
          <option value="" disabled>
            Select a role
          </option>
          <option value="Cashier">Cashier</option>
          <option value="Manager">Manager</option>
          <option value="Barista">Barista</option>
          <option value="Cook">Cook</option>
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="salary"
            className="block text-sm font-medium text-gray-700"
          >
            Salary (Annual)
          </label>
          <input
            type="number"
            id="salary"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            required
            min="0"
          />
        </div>
        <div>
          <label
            htmlFor="hours"
            className="block text-sm font-medium text-gray-700"
          >
            Hours (Weekly)
          </label>
          <input
            type="number"
            id="hours"
            value={hoursWorked}
            onChange={(e) => setHoursWorked(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            required
            min="0"
            step="1"
          />
        </div>
      </div>

      {formError && <p className="text-red-500 text-sm">{formError}</p>}

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save Employee"}
        </button>
      </div>
    </form>
  );
};

const StaffManager = () => {
  // --- State for data, loading, and errors ---
  const [staff, setStaff] = useState<Staff[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- State for modal ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStaff, setCurrentStaff] = useState<Staff | null>(null); // null = new, Staff = editing

  // --- Data Fetching ---
  const fetchStaff = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiFetch("/api/staff");
      if (!response.ok) {
        throw new Error("Failed to fetch staff.");
      }
      const data: Staff[] = await response.json();
      setStaff(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  // --- Modal Handlers ---
  const openAddModal = () => {
    setCurrentStaff(null);
    setIsModalOpen(true);
  };

  const openEditModal = (staffMember: Staff) => {
    setCurrentStaff(staffMember);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentStaff(null);
  };

  // --- CRUD Handlers ---

  /**
   * Called by StaffForm on successful save.
   * Updates the local state to reflect the change.
   */
  const handleSaveSuccess = (savedStaff: Staff) => {
    if (currentStaff) {
      // We were editing, so replace the old item
      setStaff(
        staff.map((s) => (s.staff_id === savedStaff.staff_id ? savedStaff : s))
      );
    } else {
      // We were adding, so append the new item
      setStaff([...staff, savedStaff]);
    }
    closeModal();
  };

  /**
   * Deletes a staff member.
   */
  const handleDelete = async (staffId: string) => {
    if (
      !window.confirm(
        `Are you sure you want to delete staff member "${staffId}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const response = await apiFetch(`/api/staff/${staffId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to delete staff member.");
      }

      // Remove from state on success
      setStaff(staff.filter((s) => s.staff_id !== staffId));
      alert("Staff member deleted successfully.");
    } catch (err: any) {
      alert(`Error: ${err.message}`);
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

    return (
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">
                Staff ID
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">
                Name
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">
                Role
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">
                Email
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">
                Salary
              </th>
              <th className="p-4 text-right text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {staff.map((staffMember) => (
              <tr key={staffMember.staff_id}>
                <td className="p-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {staffMember.staff_id}
                </td>
                <td className="p-4 whitespace-nowrap text-sm text-gray-500">
                  {staffMember.name}
                </td>
                <td className="p-4 whitespace-nowrap text-sm text-gray-500">
                  <span
                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      staffMember.role === "Manager"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {staffMember.role}
                  </span>
                </td>
                <td className="p-4 whitespace-nowrap text-sm text-gray-500">
                  {staffMember.email}
                </td>
                <td className="p-4 whitespace-nowrap text-sm text-gray-500">
                  ${(staffMember.salary ?? 0).toLocaleString()}
                </td>
                <td className="p-4 whitespace-nowrap text-sm font-medium text-right space-x-4">
                  <button
                    onClick={() => openEditModal(staffMember)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(staffMember.staff_id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
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
        <h2 className="text-3xl font-bold">Staff Management</h2>
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
        >
          + Add Employee
        </button>
      </div>

      {renderContent()}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={currentStaff ? "Edit Employee" : "Add New Employee"}
      >
        <StaffForm
          staff={currentStaff}
          onSuccess={handleSaveSuccess}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
};

/**
 * A reusable form for creating a new inventory item.
 * It's rendered inside the Modal.
 */
const InventoryAddForm = ({
  onSuccess,
  onCancel,
}: {
  onSuccess: (newItem: Inventory) => void;
  onCancel: () => void;
}) => {
  // --- Form State ---
  const [name, setName] = useState("");
  const [unitsRemaining, setUnitsRemaining] = useState("");
  const [numServings, setNumServings] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // --- Submit Handler ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    const url = "/api/inventory"; // POST request
    const method = "POST";

    const payload = {
      name: name,
      units_remaining: parseFloat(unitsRemaining),
      numServings: parseFloat(numServings),
    };

    // Basic validation
    if (!payload.name) {
      setFormError("Item name is required.");
      setIsSubmitting(false);
      return;
    }
    if (
      isNaN(payload.units_remaining) ||
      isNaN(payload.numServings) ||
      payload.units_remaining < 0 ||
      payload.numServings < 0
    ) {
      setFormError("Please enter valid, non-negative numbers for all fields.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await apiFetch(url, {
        method: method,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to create item.");
      }

      const newItem: Inventory = await response.json();
      onSuccess(newItem); // Pass the newly created item back
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Render ---
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Item Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="units"
            className="block text-sm font-medium text-gray-700"
          >
            Units Remaining
          </label>
          <input
            type="number"
            id="units"
            value={unitsRemaining}
            onChange={(e) => setUnitsRemaining(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            required
            min="0"
            step="any"
          />
        </div>
        <div>
          <label
            htmlFor="servings"
            className="block text-sm font-medium text-gray-700"
          >
            Number of Servings
          </label>
          <input
            type="number"
            id="servings"
            value={numServings}
            onChange={(e) => setNumServings(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            required
            min="0"
            step="any"
          />
        </div>
      </div>

      {formError && <p className="text-red-500 text-sm">{formError}</p>}

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Creating..." : "Create Item"}
        </button>
      </div>
    </form>
  );
};

/**
 * A reusable form for editing inventory levels.
 * It's rendered inside the Modal.
 */
const InventoryEditForm = ({
  item,
  onSuccess,
  onCancel,
}: {
  item: Inventory;
  onSuccess: (updatedItem: Inventory) => void;
  onCancel: () => void;
}) => {
  // --- Form State ---
  // We get the item and set the state for its editable fields
  const [unitsRemaining, setUnitsRemaining] = useState("");
  const [numServings, setNumServings] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // --- Effect to pre-fill form ---
  useEffect(() => {
    setUnitsRemaining(String(item.units_remaining));
    setNumServings(String(item.numServings));
  }, [item]);

  // --- Submit Handler ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    const url = `/api/inventory/${item.inv_item_id}`;
    const method = "PUT";

    const payload = {
      units_remaining: parseFloat(unitsRemaining),
      numServings: parseFloat(numServings),
    };

    // Basic validation
    if (
      isNaN(payload.units_remaining) ||
      isNaN(payload.numServings) ||
      payload.units_remaining < 0 ||
      payload.numServings < 0
    ) {
      setFormError("Please enter valid, non-negative numbers for all fields.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await apiFetch(url, {
        method: method,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to update inventory.");
      }

      const updatedItem: Inventory = await response.json();
      onSuccess(updatedItem); // Pass the updated item back
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Render ---
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800">
        Editing: {item.name}
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="units"
            className="block text-sm font-medium text-gray-700"
          >
            Units Remaining
          </label>
          <input
            type="number"
            id="units"
            value={unitsRemaining}
            onChange={(e) => setUnitsRemaining(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            required
            min="0"
            step="any"
          />
        </div>
        <div>
          <label
            htmlFor="servings"
            className="block text-sm font-medium text-gray-700"
          >
            Number of Servings
          </label>
          <input
            type="number"
            id="servings"
            value={numServings}
            onChange={(e) => setNumServings(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
            required
            min="0"
            step="any"
          />
        </div>
      </div>

      {formError && <p className="text-red-500 text-sm">{formError}</p>}

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
};

const InventoryManager = () => {
  // --- State for data, loading, and errors ---
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- State for modal ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  // currentItem is null when adding, or an Inventory object when editing
  const [currentItem, setCurrentItem] = useState<Inventory | null>(null);

  // --- Data Fetching ---
  const fetchInventory = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiFetch("/api/inventory");
      if (!response.ok) {
        throw new Error("Failed to fetch inventory.");
      }
      const data: Inventory[] = await response.json();
      setInventory(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  // --- Modal Handlers ---
  const openEditModal = (item: Inventory) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  // --- NEW: Handler for Add button ---
  const openAddModal = () => {
    setCurrentItem(null); // Set to null for "add" mode
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentItem(null); // Reset currentItem on close
  };

  // --- CRUD Handlers ---

  /**
   * Called by either form on successful save.
   * Updates the local state to reflect the change.
   */
  const handleSaveSuccess = (savedItem: Inventory) => {
    if (currentItem) {
      // We were EDITING, so replace the old item
      setInventory(
        inventory.map((i) =>
          i.inv_item_id === savedItem.inv_item_id ? savedItem : i
        )
      );
    } else {
      // We were ADDING, so append the new item
      setInventory([...inventory, savedItem]);
    }
    closeModal();
  };

  // --- Render Logic ---
  const renderContent = () => {
    if (isLoading) {
      return <Spinner />;
    }

    if (error) {
      return <p className="text-red-500 text-center">{error}</p>;
    }

    return (
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full min-w-full divide-y divide-gray-200">
          {/* ... (your <thead> is unchanged) ... */}
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">
                Item ID
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">
                Name
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">
                Units Remaining
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">
                Num. Servings
              </th>
              <th className="p-4 text-right text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {inventory.map((item) => (
              <tr key={item.inv_item_id}>
                <td className="p-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.inv_item_id}
                </td>
                <td className="p-4 whitespace-nowrap text-sm text-gray-500">
                  {item.name}
                </td>
                <td className="p-4 whitespace-nowrap text-sm text-gray-500">
                  {(item.units_remaining ?? 0).toLocaleString()}
                </td>
                <td className="p-4 whitespace-nowrap text-sm text-gray-500">
                  {/* Using item.numServings, assuming backend alias is working */}
                  {(item.numServings ?? 0).toLocaleString()}
                </td>
                <td className="p-4 whitespace-nowrap text-sm font-medium text-right space-x-4">
                  <button
                    onClick={() => openEditModal(item)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </button>
                  {/* TODO: Add Delete functionality here */}
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
        <h2 className="text-3xl font-bold">Inventory Management</h2>
        {/* --- NEW: Add Item Button --- */}
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
        >
          + Add Item
        </button>
      </div>

      {renderContent()}

      {/* --- UPDATED: Modal now handles both Add and Edit --- */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={currentItem ? "Edit Inventory Levels" : "Add New Inventory Item"}
      >
        {currentItem ? (
          // We are EDITING
          <InventoryEditForm
            item={currentItem}
            onSuccess={handleSaveSuccess}
            onCancel={closeModal}
          />
        ) : (
          // We are ADDING
          <InventoryAddForm
            onSuccess={handleSaveSuccess}
            onCancel={closeModal}
          />
        )}
      </Modal>
    </div>
  );
};

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

const OrderHistory = () => {
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
        {/* We can add a "Refresh" button here if needed */}
        <button
          onClick={() => fetchOrders()}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg shadow-sm hover:bg-gray-300"
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
};
