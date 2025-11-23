import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { apiFetch } from "../../api/http";
import Spinner from "../../components/Spinner";
import { toast } from "react-hot-toast";
import { DashboardData } from "../../types/models";


export default function AnalyticsDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await apiFetch("/api/dashboard/stats");
        if (!res.ok) throw new Error("Failed to load analytics dashboard");
        const json = await res.json();
        setData(json);
      } catch (err) {
        toast.error("Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Spinner />;
  if (!data)
    return <p className="text-red-500 text-center">No data available</p>;

  const { summary, charts } = data;

  // REGULAR COLORS
  // const COLORS = [
  //   '#4B0082', // Deep Indigo (dark purple)
  //   '#8B1A1A', // Maroon (your original)
  //   '#2F4F4F', // Dark Slate Gray
  //   '#191970', // Midnight Blue
  //   '#483D8B', // Dark Slate Blue
  //   '#2E0854', // Deep Violet
  //   '#800000', // Dark Red/Maroon
  //   '#006400', // Dark Green
  //   '#1C2526', // Almost Black (charcoal)
  //   '#353839'  // Gunmetal Gray
  // ];

  // FALL COLORS
  const COLORS = [
    '#800000', // Maroon
    '#8B4513', // Saddle Brown
    '#A0522D', // Sienna
    '#556B2F',  // Dark Olive Green
    '#D2691E', // Chocolate
    '#CD853F', // Peru
    '#B8860B', // Dark Goldenrod
    '#FF8C00', // Dark Orange
    '#B22222', // Firebrick
    '#654321', // Dark Brown
  ];

  // FOURTH OF JULY COLORS
  // const COLORS = [
  //   '#8C1D40', // Firecracker Crimson
  //   '#003087', // Midnight Navy
  //   '#C0C0C0', // Silver Sparkle (fireworks)
  //   '#A52A2A', // Flag Red
  //   '#00205B', // Deep Patriot Blue
  // ];

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-800">Data Analytics</h2>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            bg: COLORS[0],               // Saddle Brown
            value: `$${summary.totalRevenue30Days.toFixed(2)}`,
            label: 'Revenue (30d)',
          },
          {
            bg: COLORS[1],               // Sienna
            value: summary.today.orders,
            label: 'Orders Today',
          },
          {
            bg: COLORS[2],               // Chocolate
            value: `$${summary.today.revenue.toFixed(2)}`,
            label: "Today's Revenue",
          },
          {
            bg: COLORS[3],               // Peru
            value: summary.lowStockItems,
            label: 'Low Stock Alerts',
          },
        ].map((card, idx) => (
          <div
            key={idx}
            className="p-6 rounded-xl shadow-lg text-white"
            style={{ backgroundColor: card.bg }}   // <-- dynamic fall color
          >
            <p className="text-4xl font-bold">{card.value}</p>
            <p className="text-lg opacity-90">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Over Time */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Revenue Last 30 Days</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={charts.revenueOverTime}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" /> 
              <YAxis />
              <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#8B1A1A"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Top Selling Products</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={charts.topProducts}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-35} textAnchor="end" height={80} tick={{ fontSize: 10 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="units_sold">
                {charts.topProducts.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Sales by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={charts.categoryBreakdown}
                dataKey="sold"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {charts.categoryBreakdown.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Hourly Orders */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold mb-4">
            Peak Hours (Last 7 Days)
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={charts.hourlyOrders}>
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="hour"
                tickFormatter={(h) => `${h}:00`}
                tick={{ fontSize: 12 }}
              />

              <YAxis tick={{ fontSize: 12 }} />

              <Tooltip
                contentStyle={{ fontSize: 13 }}
                labelStyle={{ fontSize: 14, fontWeight: 'bold' }}
              />

              {/* ---------- MULTI-COLOR BAR ---------- */}
              <Bar dataKey="count">
                {charts.hourlyOrders.map((entry, idx) => (
                  <Cell
                    key={`hour-${idx}`}
                    fill={COLORS[idx % COLORS.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Low Stock Alerts */}
      {charts.lowStockAlerts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-red-800">
              Low Stock Alerts
            </h3>
            <p className="text-sm font-medium text-red-700 bg-red-100 px-3 py-1 rounded-full">
              Remaining Servings
            </p>
          </div>
          <div className="space-y-3">
            {charts.lowStockAlerts.map((item) => (
              <div
                key={item.name}
                className="flex justify-between items-center bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
              >
                <div>
                  <p className="font-medium text-gray-800">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    {item.servings_left > 0
                      ? `${item.servings_left} servings left`
                      : "OUT OF STOCK"}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-red-600">
                    {item.servings_left}
                  </p>
                  {item.servings_left > 0 && (
                    <p className="text-xs text-gray-500">
                      ~{Math.ceil(item.servings_left / 50)} days
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Staff Performance Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <h3 className="text-xl font-semibold p-6 bg-gray-50 border-b">
          Staff Performance
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">
                  Role
                </th>
                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">
                  Hours
                </th>
                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">
                  Salary
                </th>
                <th className="p-4 text-left text-xs font-medium text-gray-500 uppercase">
                  Hourly Rate
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {charts.staffPerformance.map((s) => (
                <tr key={s.name}>
                  <td className="p-4 font-medium">{s.name}</td>
                  <td className="p-4 text-gray-600">{s.role}</td>
                  <td className="p-4">{s.hours}</td>
                  <td className="p-4">${s.salary.toFixed(2)}</td>
                  <td className="p-4 font-semibold">
                    ${s.hourly_rate.toFixed(2)}/hr
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
