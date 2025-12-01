import { Product } from "../../types/models";
import { T } from "../../contexts/LangContext";

export default function KioskProductCard({
  product,
  onSelect,
}: {
  product: Product;
  onSelect: (p: Product) => void;
}) {
  return (
    <button
      onClick={() => onSelect(product)}
      className="
        bg-white dark:bg-black 
        rounded-xl shadow-md hover:shadow-2xl 
        transition-all duration-300
        p-4 magnifier:p-8
        flex flex-col items-center text-center
        w-full
        min-h-48 magnifier:min-h-64
      "
    >
      {/* Product Name - grows nicely */}
      <p
        className="
          text-lg md:text-xl 
          magnifier:text-3xl lg:magnifier:text-4xl 
          font-bold dark:text-white 
          h-16 magnifier:h-10 
          flex items-center justify-center 
          leading-tight
        "
      >
        <T>{product.product_name}</T>
      </p>

      {/* Image - bigger but still fits grid */}
      <img
        src={product.img_url}
        alt={product.product_name}
        className="
          w-32 h-32 
          magnifier:w-48 magnifier:h-48 
          lg:magnifier:w-56 lg:magnifier:h-56
          object-cover rounded-lg 
          mt-3 magnifier:mt-6 
          mb-4 magnifier:mb-8
          transition-all duration-300
        "
      />

      {/* Price - very readable in magnifier mode */}
      <p
        className="
          text-xl md:text-2xl 
          magnifier:text-4xl lg:magnifier:text-5xl 
          font-bold 
          text-gray-700 dark:text-gray-200
        "
      >
        ${product.price}
      </p>
    </button>
  );
}