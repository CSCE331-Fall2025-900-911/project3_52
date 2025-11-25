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
  flavor: number;
  flavor_2: number;
  flavor_3: number;
  milk: number;
  cream: number;
  sugar: number;
  img_url: string;
};

export type CartItem = {
  cart_id: string;
  product: Product;
  quantity: number;
  size: "Small" | "Medium" | "Large" | "Bucee's";
  sugar_level: "0" | "50" | "75" | "100";
  ice_level: "0" | "50" | "75" | "100";
  toppings: string;
  final_price: number;
};

export type OrderItem = {
  product_id: number;
  size: "Small" | "Medium" | "Large" | "Bucee's";
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
  tax: number;
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
  tip: number;
  total_price: number;
  payment_method: string;
  special_notes: string;
  tax: number;
};

export type CustomizationData = {
  size: "Small" | "Medium" | "Large" | "Bucee's";
  sugar_level: "0" | "50" | "75" | "100";
  ice_level: "0" | "50" | "75" | "100";
  toppings: string;
};

export type DashboardData = {
  summary: {
    totalRevenue30Days: number;
    totalOrders30Days: number;
    totalHoursWorked: number;
    lowStockItems: number;
    today: {
      orders: number;
      revenue: number;
      avg_order: number;
    };
  };
  charts: {
    // === Existing Charts ===
    revenueOverTime: { date: string; revenue: number }[];
    topProducts: { name: string; units_sold: number; revenue: number }[];
    categoryBreakdown: { category: string; sold: number }[];
    hourlyOrders: { hour: number; count: number }[];
    lowStockAlerts: {
      name: string;
      remaining: number;
      servings_per_unit: number;
      servings_left: number;
    }[];

    // === NEW ADVANCED INSIGHTS ===
    revenueConcentration: {
      name: string;
      revenue: number;
      pct: number; // percentage of total revenue
    }[];

    toppingProfit: {
      combo: string;
      orders: number;
      revenue: number;
    }[];

    sizeAnalysis: {
      size: string;
      sold: number;
      avg_price: number;
      revenue: number;
      pct: number; // % of total item revenue
    }[];

    whaleOrders: {
      id: number;
      time: string;
      total: number;
      items: number;
    }[];

    tipBehavior: {
      method: string;
      orders: number;
      tip_pct: number;
      avg_order: number;
    }[];
  };
};

export type Lang =
  | "en"
  | "es"
  | "fr"
  | "ko"
  | "zh-CN"
  | "zh-TW"
  | "de"
  | "ja"
  | "it"
  | "ru"
  | "pt"
  | "ar"
  | "hi"
  | "cs"
  | "tr";
