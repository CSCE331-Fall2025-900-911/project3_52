import { Product } from "../../types/models";
import { T } from "../../contexts/LangContext";

export default function KioskProductCard({ product, onAddToCart }: { product: Product; onAddToCart: (p: Product) => void; }) {
  return (
    <button onClick={() => onAddToCart(product)} className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow p-4 text-center">
      <h3 className="text-lg font-bold dark:text-white"><T>{product.product_name}</T></h3>
      <p className="text-gray-600 dark:text-gray-300">${product.price}</p>
    </button>
  );
}