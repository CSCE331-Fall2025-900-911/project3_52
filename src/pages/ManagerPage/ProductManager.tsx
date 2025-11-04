import React, { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../../api/http";
import { Product } from "../../types/models";
import Modal from "../../components/Modal";
import Spinner from "../../components/Spinner";
import { toast } from "react-hot-toast";

// --- Product Form (co-located) ---
const ProductForm = ({
  product,
  onSuccess,
  onCancel,
}: {
  product: Product | null;
  onSuccess: (updatedProduct: Product) => void;
  onCancel: () => void;
}) => {
  // ... (Paste the exact code for ProductForm here) ...
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [flavor, setFlavor] = useState(0);
  const [flavor_2, setFlavor_2] = useState(0);
  const [flavor_3, setFlavor_3] = useState(0);
  const [milk, setMilk] = useState(0);
  const [cream, setCream] = useState(0);
  const [sugar, setSugar] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const isEditing = product !== null;

  useEffect(() => {
    if (isEditing) {
      setName(product.product_name);
      setPrice(String(product.price));
      setCategory(product.category);
      setFlavor(product.flavor ?? 0);
      setFlavor_2(product.flavor_2 ?? 0);
      setFlavor_3(product.flavor_3 ?? 0);
      setMilk(product.milk ?? 0);
      setCream(product.cream ?? 0);
      setSugar(product.sugar ?? 0);
    } else {
      setName("");
      setPrice("");
      setCategory("");
      setFlavor(0);
      setFlavor_2(0);
      setFlavor_3(0);
      setMilk(0);
      setCream(0);
      setSugar(0);
    }
  }, [product, isEditing]);

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
      flavor: flavor,
      flavor_2: flavor_2,
      flavor_3: flavor_3,
      milk: milk,
      cream: cream,
      sugar: sugar,
    };
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
      onSuccess(savedProduct);
    } catch (err: any) {
      setFormError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* ... (Paste the full JSX for ProductForm) ... */}
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
          htmlFor="flavor"
          className="block text-sm font-medium text-gray-700"
        >
          Flavor
        </label>
        <input
          type="number"
          id="flavor"
          value={flavor}
          onChange={(e) => setFlavor(Number(e.target.value))}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          required
          min="0"
          step="1"
        />
      </div>

      <div>
        <label
          htmlFor="flavor_2"
          className="block text-sm font-medium text-gray-700"
        >
          Flavor 2
        </label>
        <input
          type="number"
          id="flavor_2"
          value={flavor_2}
          onChange={(e) => setFlavor_2(Number(e.target.value))}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          required
          min="0"
          step="1"
        />
      </div>

      <div>
        <label
          htmlFor="flavor_3"
          className="block text-sm font-medium text-gray-700"
        >
          Flavor 3
        </label>
        <input
          type="number"
          id="flavor_3"
          value={flavor_3}
          onChange={(e) => setFlavor_3(Number(e.target.value))}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          required
          min="0"
          step="1"
        />
      </div>

      <div>
        <label
          htmlFor="milk"
          className="block text-sm font-medium text-gray-700"
        >
          Milk
        </label>
        <input
          type="number"
          id="milk"
          value={milk}
          onChange={(e) => setMilk(Number(e.target.value))}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          required
          min="0"
          step="0.05"
        />
      </div>

      <div>
        <label
          htmlFor="cream"
          className="block text-sm font-medium text-gray-700"
        >
          Cream
        </label>
        <input
          type="number"
          id="cream"
          value={cream}
          onChange={(e) => setCream(Number(e.target.value))}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          required
          min="0"
          step="1"
        />
      </div>

      <div>
        <label
          htmlFor="sugar"
          className="block text-sm font-medium text-gray-700"
        >
          Sugar
        </label>
        <input
          type="number"
          id="sugar"
          value={sugar}
          onChange={(e) => setSugar(Number(e.target.value))}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
          required
          min="0"
          step="1"
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
          className="px-4 py-2 bg-maroon text-white rounded-lg shadow hover:bg-darkmaroon disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save Product"}
        </button>
      </div>
    </form>
  );
};

// --- Product Manager (the main export) ---
export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

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

  const handleSaveSuccess = async (_savedProduct: Product) => {
    toast.success("Product updated successfully!");
    await fetchProducts();
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
                ID
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">
                Name
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">
                Category
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">
                Price
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">
                Flavor
              </th>
              {/* <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">
                Flavor_2
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">
                Flavor_3
              </th> */}
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">
                Milk
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">
                Cream
              </th>
              <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">
                Sugar
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
                  {product.product_id}
                </td>
                <td className="p-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {product.product_name}
                </td>
                <td className="p-4 whitespace-nowrap text-sm text-gray-500">
                  {product.category}
                </td>
                <td className="p-4 whitespace-nowrap text-sm text-gray-500">
                  ${product.price}
                </td>
                <td className="p-4 whitespace-nowrap text-sm text-gray-500">
                  {product.flavor}
                </td>
                {/* <td className="p-4 whitespace-nowrap text-sm text-gray-500">
                  {product.flavor_2}
                </td>
                <td className="p-4 whitespace-nowrap text-sm text-gray-500">
                  {product.flavor_3}
                </td> */}
                <td className="p-4 whitespace-nowrap text-sm text-gray-500">
                  {product.milk}
                </td>
                <td className="p-4 whitespace-nowrap text-sm text-gray-500">
                  {product.cream}
                </td>
                <td className="p-4 whitespace-nowrap text-sm text-gray-500">
                  {product.sugar}
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
          className="px-4 py-2 bg-maroon text-white rounded-lg shadow hover:bg-darkmaroon"
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
}
