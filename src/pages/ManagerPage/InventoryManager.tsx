import React, { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../../api/http";
import { Inventory } from "../../types/models";
import Modal from "../../components/Modal";
import Spinner from "../../components/Spinner";
import { toast } from "react-hot-toast";

// --- Inventory Add Form (co-located) ---
const InventoryAddForm = ({
  onSuccess,
  onCancel,
}: {
  onSuccess: (newItem: Inventory) => void;
  onCancel: () => void;
}) => {
  // ... (Paste the exact code for InventoryAddForm here) ...
  const [name, setName] = useState("");
  const [unitsRemaining, setUnitsRemaining] = useState("");
  const [numServings, setNumServings] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);
    const url = "/api/inventory";
    const method = "POST";
    const payload = {
      name: name,
      units_remaining: parseFloat(unitsRemaining),
      numServings: parseFloat(numServings),
    };
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
      onSuccess(newItem);
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* ... (Paste the full JSX for InventoryAddForm) ... */}
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
          className="px-4 py-2 bg-maroon text-white rounded-lg shadow hover:bg-darkmaroon disabled:opacity-50"
        >
          {isSubmitting ? "Creating..." : "Create Item"}
        </button>
      </div>
    </form>
  );
};

// --- Inventory Edit Form (co-located) ---
const InventoryEditForm = ({
  item,
  onSuccess,
  onCancel,
}: {
  item: Inventory;
  onSuccess: (updatedItem: Inventory) => void;
  onCancel: () => void;
}) => {
  // ... (Paste the exact code for InventoryEditForm here) ...
  const [unitsRemaining, setUnitsRemaining] = useState("");
  const [numServings, setNumServings] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    setUnitsRemaining(String(item.units_remaining));
    setNumServings(String(item.numServings));
  }, [item]);

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
      onSuccess(updatedItem);
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* ... (Paste the full JSX for InventoryEditForm) ... */}
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
          className="px-4 py-2 bg-maroon text-white rounded-lg shadow hover:bg-darkmaroon disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
};

// --- Inventory Manager (the main export) ---
// (We built this in a previous step, so I'm pasting it here)
export default function InventoryManager() {
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<Inventory | null>(null);

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

  const openEditModal = (item: Inventory) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setCurrentItem(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentItem(null);
  };

  const handleSaveSuccess = async (_savedItem: Inventory) => {
    toast.success("Inventory updated successfully!");
    await fetchInventory();
    closeModal();
  };

  const renderContent = () => {
    if (isLoading) return <Spinner />;
    if (error) return <p className="text-red-500 text-center">{error}</p>;

    return (
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full min-w-full divide-y divide-gray-200">
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
                  {(item.numServings ?? 0).toLocaleString()}
                </td>
                <td className="p-4 whitespace-nowrap text-sm font-medium text-right space-x-4">
                  <button
                    onClick={() => openEditModal(item)}
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
        <h2 className="text-3xl font-bold">Inventory Management</h2>
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-maroon text-white rounded-lg shadow hover:bg-darkmaroon"
        >
          + Add Item
        </button>
      </div>

      {renderContent()}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={currentItem ? "Edit Inventory Levels" : "Add New Inventory Item"}
      >
        {currentItem ? (
          <InventoryEditForm
            item={currentItem}
            onSuccess={handleSaveSuccess}
            onCancel={closeModal}
          />
        ) : (
          <InventoryAddForm
            onSuccess={handleSaveSuccess}
            onCancel={closeModal}
          />
        )}
      </Modal>
    </div>
  );
}
