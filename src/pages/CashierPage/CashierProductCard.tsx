import { Product } from "../../types/models";
import { T } from "../../contexts/LangContext";


export default function CashierProductCard({ 
  product, 
  onSelect  // <-- RENAMED
}: { 
  product: Product; 
  onSelect: (p: Product) => void; // <-- RENAMED
}) {
  return (
    <button 
      onClick={() => onSelect(product)} // <-- CHANGED
      className="bg-white dark:bg-black rounded-lg shadow-md hover:shadow-xl transition-shadow p-4 flex flex-col items-center text-center"
    >
      <h3 className="text-lg font-bold dark:text-white"><T>{product.product_name}</T></h3>
      <p className="text-gray-600 dark:text-gray-300">${product.price}</p>
    </button>
  );
}