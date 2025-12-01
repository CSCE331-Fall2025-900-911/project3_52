import { useEffect, useMemo, useState } from "react";
import { kioskApiFetch } from "../../api/http";
import { CartItem, OrderPayload, Product } from "../../types/models";
import { LanguageProvider, T } from "../../contexts/LangContext";
import Spinner from "../../components/Spinner";
import KioskHeader from "./KioskHeader";
import KioskProductCard from "./KioskProductCard";
import KioskCartItem from "./CartItem";
import { toast } from "react-hot-toast";
import Modal from "../../components/Modal";
import { CustomizationData } from "../../types/models";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "../../components/PaymentForm";
import { loadStripe } from "@stripe/stripe-js";
import PayPalCheckout from "../../components/PaypalCheckout";
import { MagnifierProvider } from "../../contexts/MagnifierContext";

const AVAILABLE_TOPPINGS = [
  "Boba",
  "Lychee Jelly",
  "Grass Jelly",
  "Pudding",
  "Red Bean",
  "Crystal Boba",
];
const CustomizationForm = ({
  product,
  onSubmit,
}: {
  product: Product;
  onSubmit: (data: CustomizationData) => void;
}) => {
  // Internal state for the form, with defaults
  const [size, setSize] = useState<"Small" | "Medium" | "Large" | "Bucee's">(
    "Medium"
  );
  const [sugar, setSugar] = useState<"0" | "50" | "75" | "100">("100");
  const [ice, setIce] = useState<"0" | "50" | "75" | "100">("100");

  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);

  // --- UPDATED: Handler to limit selection to 3 ---
  const handleToppingChange = (topping: string) => {
    setSelectedToppings((prev) => {
      const isSelected = prev.includes(topping);

      if (isSelected) {
        // Always allow un-checking
        return prev.filter((t) => t !== topping);
      } else {
        // Only allow checking if under the limit
        if (prev.length < 3) {
          return [...prev, topping];
        } else {
          // Show a warning and do not add the 4th topping
          toast.error("You can select up to 3 toppings");
          return prev; // Return the state unchanged
        }
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      size: size,
      sugar_level: sugar,
      ice_level: ice,
      toppings: selectedToppings.join(", "),
    });
  };

  // This will be true when 3 toppings are selected
  const toppingsLimitReached = selectedToppings.length >= 3;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <p className="text-lg dark:text-gray-200">
        <T>Customizing</T>:{" "}
        <span className="font-bold">{product.product_name}</span>
      </p>

      {/* Size Selector (Added p-3 for better mobile tap) */}
      <label className="block">
        <span className="text-gray-700 dark:text-gray-300">
          <T>Size</T>
        </span>
        <select
          value={size}
          onChange={(e) => setSize(e.target.value as any)}
          className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:text-white"
        >
          <option value="Small">Small</option>
          <option value="Medium">Medium</option>
          <option value="Large">Large</option>
          <option value="Bucee's">Bucee's</option>
        </select>
      </label>

      {/* Sugar Selector (Added p-3 for better mobile tap) */}
      <label className="block">
        <span className="text-gray-700 dark:text-gray-300">
          <T>Sugar Level</T>
        </span>
        <select
          value={sugar}
          onChange={(e) => setSugar(e.target.value as any)}
          className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:text-white"
        >
          <option value="100">100%</option>
          <option value="75">75%</option>
          <option value="50">50%</option>
          <option value="0">0%</option>
        </select>
      </label>

      {/* Ice Selector (Added p-3 for better mobile tap) */}
      <label className="block">
        <span className="text-gray-700 dark:text-gray-300">
          <T>Ice Level</T>
        </span>
        <select
          value={ice}
          onChange={(e) => setIce(e.target.value as any)}
          className="mt-1 block w-full p-3 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:text-white"
        >
          <option value="100">100%</option>
          <option value="75">75%</option>
          <option value="50">50%</option>
          <option value="0">0%</option>
        </select>
      </label>

      {/* --- UPDATED: Toppings Fieldset --- */}
      <fieldset>
        <div className="flex justify-between items-center">
          <legend className="block text-gray-700 dark:text-gray-300">
            <T>Toppings</T>
          </legend>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            <T>Select up to 3</T> ({selectedToppings.length} / 3)
          </span>
        </div>

        {/* Responsive grid, larger tap targets with borders */}
        <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
          {AVAILABLE_TOPPINGS.map((topping) => {
            const isSelected = selectedToppings.includes(topping);
            // Disable if limit is reached AND this item is not already selected
            const isDisabled = toppingsLimitReached && !isSelected;

            return (
              <label
                key={topping}
                className={`flex items-center gap-2 p-3 rounded-md border cursor-pointer 
                            dark:border-gray-600 
                            ${
                              isSelected
                                ? "bg-maroon/10 border-maroon"
                                : "hover:bg-gray-100 dark:hover:bg-gray-700"
                            }
                            ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
                          `}
              >
                <input
                  type="checkbox"
                  className="h-5 w-5 rounded text-maroon focus:ring-maroon"
                  checked={isSelected}
                  disabled={isDisabled} // Disable the checkbox
                  onChange={() => handleToppingChange(topping)}
                />
                <span className="dark:text-gray-200">
                  <T>{topping}</T>
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>
      {/* --- END UPDATE --- */}

      <button
        type="submit"
        className="w-full py-4 mt-4 bg-maroon text-white text-xl font-bold rounded-lg shadow-lg hover:bg-darkmaroon transition-colors"
      >
        <T>Add to Order</T>
      </button>
    </form>
  );
};

export default function KioskPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isHighContrast, setIsHighContrast] = useState(
    localStorage.getItem("kiosk.highContrast") === "true"
  );
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isStripeModalOpen, setIsStripeModalOpen] = useState(false);
  const [isPayPalModalOpen, setIsPayPalModalOpen] = useState(false);
  // Initialize activeCategory from localStorage if available, else null (will set after products load)
  const [activeCategory, setActiveCategory] = useState<string | null>(() => {
    const stored = localStorage.getItem("kiosk.activeCategory");
    return stored ? stored : null;
  });
  // Dynamically derive available categories from products
  const availableCategories = useMemo(() => {
    if (!products || products.length === 0) return [];
    const categories = Array.from(new Set(products.map((p) => p.category)));
    return categories;
  }, [products]);

  // Set initial activeCategory to stored value (if present), else to first available category after products load
  useEffect(() => {
    if (
      products.length > 0 &&
      availableCategories.length > 0 &&
      !activeCategory
    ) {
      const stored = localStorage.getItem("kiosk.activeCategory");
      if (stored && availableCategories.includes(stored)) {
        setActiveCategory(stored);
      } else {
        setActiveCategory(availableCategories[0]);
      }
    }
  }, [products, availableCategories, activeCategory]);

  // --- NEW STATE for customization modal ---
  const [isCustomizationModalOpen, setIsCustomizationModalOpen] =
    useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [specialNotes, setSpecialNotes] = useState("");

  const stripePromise = loadStripe(
    "pk_test_51SQ9h8HxLrRxAwUAXhDDu2tC5tKVWITYIGhCfr8Jjjkq9IFhjnUoOCaDUa4gNy9BRaOHTRNuLrZ39piTTYCD5Hyv00Y0s0Vcsq"
  );

  useEffect(() => {
    localStorage.setItem("kiosk.highContrast", isHighContrast.toString());
  }, [isHighContrast]);

  useEffect(() => {
    kioskApiFetch("/api/products")
      .then((res) => res.json())
      .then(setProducts)
      .catch(() => setError("Could not load products."))
      .finally(() => setIsLoading(false));
  }, []);

  // --- RENAMED: This now opens the modal ---
  const openCustomizationModal = (product: Product) => {
    setSelectedProduct(product);
    setIsCustomizationModalOpen(true);
  };

  // --- NEW: This is the new "Add to Cart" handler, called by the form ---
  // MODIFIED: issue with original implementation where price was directly mutated, affecting subsequent purchases of the same drink
  //fix so the original/base price doesn't change after alterations are made
  const handleAddToCart = (customData: CustomizationData) => {
    if (!selectedProduct) return; // Guard clause

    //shallow product copy to avoid mutating original
    const productCopy = { ...selectedProduct };

    let final_price = productCopy.price;

    // Calculate final price based on customizations
    if (customData.size === "Large") {
      final_price += 1.0;
    } else if (customData.size === "Bucee's") {
      final_price += 2.0;
    } else if (customData.size === "Small") {
      final_price -= 0.5;
    }
    if (customData.toppings) {
      final_price += 0.75;
    }

    const newCartItem: CartItem = {
      cart_id: crypto.randomUUID(),
      product: selectedProduct,
      quantity: 1,
      ...customData,
      final_price: final_price,
    };

    setCart((prev) => [...prev, newCartItem]);

    // Close and reset
    setIsCustomizationModalOpen(false);
    setSelectedProduct(null);
    toast.success(`${selectedProduct.product_name} added to order!`);
  };

  const removeFromCart = (id: string) =>
    setCart((prev) => prev.filter((i) => i.cart_id !== id));

  const subtotal = useMemo(
    () => cart.reduce((s, i) => s + i.final_price, 0),
    [cart]
  );

  const taxRate = 0.0825; // temporary static tax rate

  const tax = useMemo(
    () => Number((subtotal * taxRate).toFixed(2)), //assuming tax rate in Cstat = 8.25%
    [subtotal]
  );

  const total = useMemo(
    () => subtotal + tax,
    [subtotal, tax]
  )

  const handleFinalSubmit = async (
    paymentMethod: "Card" | "Mobile Pay" | "Cash"
  ) => {
    // Handle special payment flows first
    if (paymentMethod === "Card") {
      setIsStripeModalOpen(true);
      return;
    }

    if (paymentMethod === "Mobile Pay") {
      // Open PayPal modal instead of direct order
      setIsPayPalModalOpen(true);
      return;
    }

    // Normal flow for non-digital payments
    setIsSubmitting(true);
    setSubmitError(null);

    const now = new Date();
    const payload: OrderPayload = { 
      time: now.toTimeString().split(" ")[0],
      day: now.getDate(),
      month: now.getMonth() + 1,
      year: now.getFullYear(),
      total_price: total,
      tip: 0,
      special_notes: specialNotes,
      payment_method: paymentMethod,
      items: cart.map((i) => ({
        product_id: i.product.product_id,
        size: i.size,
        sugar_level: i.sugar_level,
        ice_level: i.ice_level,
        toppings: i.toppings,
        price: i.final_price,
      })),
      tax: tax,
    };

    try {
      const res = await kioskApiFetch("/api/orders", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        const errorText = err.error || "Failed to submit order";
        toast.error(errorText);
        setSubmitError(errorText);
        return;
      }

      toast.success("Order submitted successfully!");
      setCart([]);
      setSpecialNotes("");
      setIsPaymentModalOpen(false);
    } catch (e: any) {
      const errorText = e.message || "An unknown error occurred";
      toast.error(errorText);
      setSubmitError(errorText);
    } finally {
      setIsSubmitting(false);
    }
  };

  const PaymentButton = ({
    label,
    onClick,
    disabled,
  }: {
    label: string;
    onClick: () => void;
    disabled: boolean;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full py-4 bg-maroon text-white text-xl font-bold rounded-lg shadow-lg disabled:opacity-50 hover:bg-darkmaroon transition-colors"
    >
      <T>{label}</T>
    </button>
  );

  useEffect(() => {
    if (isHighContrast) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isHighContrast]);

  //sort the drinks according to category, for display later in the button tab
  const groupedProducts = useMemo(() => {
    return products.reduce((groups, product) => {
      const category = product.category || "Other";
      if (!groups[category]) groups[category] = [];
      groups[category].push(product);
      return groups;
    }, {} as Record<string, Product[]>);
  }, [products]);

  return (
    <MagnifierProvider>
      <LanguageProvider>
        <div className="relative h-screen">
          <div className="flex flex-col lg:flex-row h-screen">
            {/* --- LEFT: Products --- */}
            <div className="w-full lg:w-2/3 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900">
              <KioskHeader
                isHighContrast={isHighContrast}
                setIsHighContrast={setIsHighContrast}
              />

              {/* Category selector: dropdown on small screens, buttons on sm+ */}
              {/* Dropdown for small screens */}
              <div className="mb-4 mt-4">
                <div className="sm:hidden flex w-full">
                  <select
                    title = "Select Category" //added for accessibility, remove warning
                    aria-label="Select Category"
                    className="block w-full p-3 rounded-lg border bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 text-center text-lg font-semibold"
                    value={activeCategory ?? ""}
                    onChange={(e) => {
                      setActiveCategory(e.target.value);
                      localStorage.setItem("kiosk.activeCategory", e.target.value);
                    }}
                  >
                    {availableCategories.map((category) => (
                      <option key={category} value={category}>
                        {category.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Buttons for sm+ screens */}
                <div className="hidden sm:flex w-full overflow-x-auto mb-4">
                  <div className="flex w-full justify-between gap-1 sm:gap-2">
                    {availableCategories.map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          setActiveCategory(category);
                          localStorage.setItem("kiosk.activeCategory", category);
                        }}
                        className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-colors
                          ${
                            activeCategory === category
                              ? "bg-maroon text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200"
                          }`}
                      >
                        <T>{category.toUpperCase()}</T>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Products */}
              {isLoading && <Spinner />}
              {error && <p className="text-red-500">{error}</p>}

              {!isLoading && !error && activeCategory && (
                <div key={activeCategory} className="mb-8 animate-fadeIn">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 magnifier:grid-cols-3">
                    {(groupedProducts[activeCategory] || [])
                      .filter(
                        (p) => p.product_name.toUpperCase() !== "CUSTOM TEA"
                      ) //specifically excludes CUSTOM TEA drink
                      .map((p) => (
                        <KioskProductCard
                          key={p.product_id}
                          product={p}
                          onSelect={openCustomizationModal}
                        />
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* --- RIGHT: Cart --- */}
            <div
              className="
                w-full lg:w-1/3 
                bg-white dark:bg-gray-800 shadow-lg p-6 flex flex-col
                border-t lg:border-t-0
                lg:fixed lg:top-20 lg:right-0 lg:h-[calc(100vh-5rem)]
                "
            >
              <h2 className="text-2xl magnifier:text-5xl md:text-3xl font-bold mb-4 dark:text-white text-center lg:text-left">
                <T>Your Order</T>
              </h2>

              <div className="flex-grow overflow-y-auto mb-4">
                {cart.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center lg:text-left">
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
              
              <div className="border-t pt-4 mt-2 dark:border-gray-700">
                <label className="block mb-2 text-xl md:text-2xl font-bold dark:text-white">Special Notes</label>
                <input
                  type="text"
                  value={specialNotes}
                  onChange={(e) => {
                      setSpecialNotes(e.target.value);
                    }}
                  placeholder="Anything you want us to know? (e.g., allergies, preferences)"
                  className="w-full p-2 border border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:text-white"
                />
              </div>

            <div className="border-t pt-2 mt-1 dark:border-gray-700">
                <div className="flex flex-col gap-1 mb-2 dark:text-white">
                  <div className="flex justify-between text-xs md:text-base text-gray-600 dark:text-gray-300 mb-.1">
                    <span>
                      <T>Subtotal</T>:
                    </span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>

                  <div className="flex justify-between text-xs md:text-base text-gray-600 dark:text-gray-300 mb-.5">
                    <span>Tax:</span>
                    <span>${tax}</span>
                  </div>
                  
                  <div className="flex justify-between text-3xl md:text-3xl font-bold">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                <button
                  onClick={() => {setIsPaymentModalOpen(true);}}
                  disabled={cart.length === 0}
                  className="w-full py-3 md:py-4 bg-maroon text-white text-lg md:text-xl font-bold rounded-lg shadow-lg disabled:opacity-50 hover:bg-darkmaroon"
                >
                  <T>Pay Now</T>
                </button>
              </div>
            </div>

            <Modal
              isOpen={isPaymentModalOpen}
              onClose={() => {setIsPaymentModalOpen(false);
                          }}
              title="Select Payment Method"
              isDarkMode={isHighContrast}
            >
              <div className="flex flex-col gap-4 dark:bg-gray-900 dark:text-gray-100 p-4 rounded-lg transition-colors">
                <p className="text-lg md:text-xl text-center">
                  <T>Your total is</T>:
                  <span className="font-bold ml-2 text-maroon dark:text-yellow-300">
                    ${total.toFixed(2)}
                  </span>
                </p>

                <PaymentButton
                  label="Card"
                  onClick={() => handleFinalSubmit("Card")}
                  disabled={isSubmitting}
                />
                <PaymentButton
                  label="PayPal (Mobile Pay)"
                  onClick={() => handleFinalSubmit("Mobile Pay")}
                  disabled={isSubmitting}
                />
                <PaymentButton
                  label="Cash (Pay at Counter)"
                  onClick={() => handleFinalSubmit("Cash")}
                  disabled={isSubmitting}
                />

                {isSubmitting && <Spinner />}
                {submitError && (
                  <p className="text-red-500 text-center font-semibold">
                    {submitError}
                  </p>
                )}
              </div>
            </Modal>

            {selectedProduct && (
              <Modal
                isOpen={isCustomizationModalOpen}
                onClose={() => {
                  setIsCustomizationModalOpen(false);
                  setSelectedProduct(null);
                }}
                title="Customize Your Drink"
                isDarkMode={isHighContrast}
              >
                <div className="dark:bg-gray-900 dark:text-gray-100 p-4 rounded-lg transition-colors">
                  <CustomizationForm
                    product={selectedProduct}
                    onSubmit={handleAddToCart}
                  />
                </div>
              </Modal>
            )}

            {isStripeModalOpen && (
              <Modal
                isOpen={isStripeModalOpen}
                onClose={() => {
                  setIsStripeModalOpen(false);
                  
                }}
                title="Card Payment"
                isDarkMode={isHighContrast}
              >
                <Elements stripe={stripePromise}>
                  <PaymentForm
                    total={total}
                    isDarkMode={isHighContrast}
                    onSuccess={async () => {
                      setIsStripeModalOpen(false);
                      
                      await handleFinalSubmit("Cash"); // reuse existing backend logic to save order
                    }}
                  />
                </Elements>
              </Modal>
            )}

            {isPayPalModalOpen && (
              <Modal
                isOpen={isPayPalModalOpen}
                onClose={() => {
                  setIsPayPalModalOpen(false);
                  
                }}
                title="Pay with PayPal"
              >
                <PayPalCheckout
                  total={total}
                  onSuccess={() => {
                    toast.success("Payment successful via PayPal!");
                    setIsPayPalModalOpen(false);
                    
                    handleFinalSubmit("Cash"); // record order after PayPal
                  }}
                />
              </Modal>
            )}
          </div>
        </div>
      </LanguageProvider>
    </MagnifierProvider>
  );
}
