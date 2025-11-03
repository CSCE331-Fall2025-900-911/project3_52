import { useEffect, useMemo, useState } from "react";
import { kioskApiFetch } from "../../api/http";
import { CartItem, OrderPayload, Product } from "../../types/models";
import { LanguageProvider, T } from "../../contexts/LangContext";
import Spinner from "../../components/Spinner";
import KioskHeader from "./KioskHeader";
import KioskProductCard from "./KioskProductCard";
import KioskCartItem from "./KioskCartItem";
import { toast } from "react-hot-toast";

export default function KioskPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    kioskApiFetch("/api/products")
      .then((res) => res.json())
      .then(setProducts)
      .catch(() => setError("Could not load products."))
      .finally(() => setIsLoading(false));
  }, []);

  const addToCart = (product: Product) => {
    setCart((prev) => [
      ...prev,
      {
        cart_id: crypto.randomUUID(),
        product,
        quantity: 1,
        size: "Medium",
        sugar_level: "100",
        ice_level: "100",
        toppings: "",
        final_price: product.price,
      },
    ]);
  };
  const removeFromCart = (id: string) =>
    setCart((prev) => prev.filter((i) => i.cart_id !== id));
  const total = useMemo(
    () => cart.reduce((s, i) => s + i.final_price, 0),
    [cart]
  );

  const submitOrder = async () => {
    const now = new Date();
    const payload: OrderPayload = {
      time: now.toTimeString().split(" ")[0],
      day: now.getDate(),
      month: now.getMonth() + 1,
      year: now.getFullYear(),
      total_price: total,
      tip: 0,
      special_notes: "Kiosk Order",
      payment_method: "Card",
      items: cart.map((i) => ({
        product_id: i.product.product_id,
        size: i.size,
        sugar_level: i.sugar_level,
        ice_level: i.ice_level,
        toppings: i.toppings,
        price: i.final_price,
      })),
    };
    const res = await kioskApiFetch("/api/orders", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json();
      // You can use toast for errors, too!
      toast.error(err.error || "Failed to submit order");
      throw new Error(err.error || "Failed to submit order");
    }
    toast.success("Order submitted successfully!");
    setCart([]);
  };

  return (
    <LanguageProvider>
      <div className={`flex h-screen ${isHighContrast ? "dark" : ""}`}>
        <div className="w-2/3 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <KioskHeader
            isHighContrast={isHighContrast}
            setIsHighContrast={setIsHighContrast}
          />
          {isLoading && <Spinner />}{" "}
          {error && <p className="text-red-500">{error}</p>}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p) => (
              <KioskProductCard
                key={p.product_id}
                product={p}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        </div>
        <div className="w-1/3 bg-white dark:bg-gray-800 shadow-lg p-6 flex flex-col">
          <h2 className="text-3xl font-bold mb-4 dark:text-white">
            <T>Your Order</T>
          </h2>
          <div className="flex-grow overflow-y-auto">
            {cart.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">
                <T>Your cart is empty.</T>
              </p>
            ) : (
              cart.map((item) => (
                <KioskCartItem
                  key={item.cart_id}
                  item={item}
                  onRemove={removeFromCart}
                />
              ))
            )}
          </div>
          <div className="border-t pt-4 mt-4 dark:border-gray-700">
            <div className="flex justify-between items-center text-2xl font-bold mb-4 dark:text-white">
              <span>
                <T>Total</T>:
              </span>
              <span>${total}</span>
            </div>
            <button
              onClick={submitOrder}
              disabled={cart.length === 0}
              className="w-full py-4 bg-maroon text-white text-xl font-bold rounded-lg shadow-lg disabled:opacity-50 hover:bg-darkmaroon"
            >
              <T>Pay Now</T>
            </button>
          </div>
        </div>
      </div>
    </LanguageProvider>
  );
}
