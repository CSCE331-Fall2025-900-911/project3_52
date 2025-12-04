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
        <p className="font-bold dark:text-white">${item.final_price}</p>
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