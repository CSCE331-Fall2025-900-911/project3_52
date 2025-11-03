export type User = {
  staff_id: string;
  name: string;
  role: "Manager" | "Cashier" | string;
  email: string;
};

export type Product = {
  product_id: number;
  product_name: string;
  price: number;
  category: string;
};

export type CartItem = {
  cart_id: string;
  product: Product;
  quantity: number;
  size: "Small" | "Medium" | "Large";
  sugar_level: "0" | "50" | "75" | "100";
  ice_level: "0" | "50" | "75" | "100";
  toppings: string;
  final_price: number;
};

export type OrderItem = {
  product_id: number;
  size: "Small" | "Medium" | "Large";
  sugar_level: "0" | "50" | "75" | "100";
  ice_level: "0" | "50" | "75" | "100";
  toppings: string;
  price: number;
};

export type OrderPayload = {
  time: string;
  day: number;
  month: number;
  year: number;
  total_price: number;
  tip: number;
  special_notes: string;
  payment_method: string;
  items: OrderItem[];
};

export type Staff = {
  staff_id: string;
  name: string;
  role: string;
  salary: number;
  hours_worked: number;
  email: string;
};

export type Inventory = {
  inv_item_id: number;
  name: string;
  units_remaining: number;
  numServings: number;
};

export type OrderHistoryRecord = {
  order_id: number;
  time: string;
  day: number;
  month: number;
  year: number;
  total_price: number;
  payment_method: string;
};


