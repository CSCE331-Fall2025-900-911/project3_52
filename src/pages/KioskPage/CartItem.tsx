import { CartItem } from "../../types/models";
import { T } from "../../contexts/LangContext";

export default function KioskCartItem({
  item,
  onRemove,
  onEdit,
}: {
  item: CartItem;
  onRemove: (id: string) => void;
  onEdit?: (id: string) => void;
}) {
  return (
    <div className="mb-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg flex">
      <div className="flex-grow">
        <h4 className="font-bold dark:text-white">
          <T>{item.product.product_name}</T>
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <T>Size</T>: {item.size}
          <T>, Sugar</T>: {item.sugar_level}
          <T>, Ice</T>: {item.ice_level} <T>, Toppings</T>:{" "}
          {item.toppings.length > 0 ? item.toppings : <T>N/A</T>}
        </p>
      </div>
      <div className="text-right">
        <p className="font-bold dark:text-white">
          ${ (item.final_price * item.quantity).toFixed(2) }
        </p>
        <div className="flex items-center gap-2 justify-end mb-1">
          <button
            onClick={() => onEdit?.(item.cart_id + ":dec")}
            disabled={item.quantity <= 1}
            className={`px-2 py-0.5 rounded 
              ${item.quantity <= 1
                ? "bg-gray-200 dark:bg-gray-700 opacity-50 cursor-not-allowed"
                : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"}
            `}
          >
            −
          </button>
          <span
            className="font-semibold dark:text-white inline-flex justify-center items-center w-6 tabular-nums"
          >
            {Math.min(99, Math.max(1, item.quantity))}
          </span>
          <button
            onClick={() => onEdit?.(item.cart_id + ":inc")}
            disabled={item.quantity >= 99}
            className={`px-2 py-0.5 rounded
              ${item.quantity >= 99
                ? "bg-gray-200 dark:bg-gray-700 opacity-50 cursor-not-allowed"
                : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"}
            `}
          >
            +
          </button>
        </div>
        {onEdit && (
          <button
            onClick={() => onEdit(item.cart_id)}
            className="text-blue-500 text-sm hover:underline mr-2"
          >
            <T>Edit</T>
          </button>
        )}
        <button
          onClick={() => onRemove(item.cart_id)}
          className="text-red-500 text-sm hover:underline"
        >
          <T>Remove</T>
        </button>
      </div>
    </div>
  );
}