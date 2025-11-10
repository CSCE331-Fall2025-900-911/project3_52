import { Product } from "../../types/models";
import { T } from "../../contexts/LangContext";
import { productImages } from "../../components/ProductImages";

export default function KioskProductCard({ 
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
      <img
        src={productImages[product.product_name]}
        alt={product.product_name}
        className="w-32 h-32 object-cover rounded-md mb-2"
        />
      <p className="text-gray-600 dark:text-gray-300">${product.price}</p>
    </button>
  );
}