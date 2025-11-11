import { useState } from "react";
import { toast } from "react-hot-toast";
import Spinner from "../../components/Spinner";
import { apiFetch } from "../../api/http";
import {
  ResponsiveContainer,
  PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from "recharts";
import type { PieLabelRenderProps } from "recharts";

type Summary = {
  total_orders?: number;
  total_revenue?: number;
  total_tips?: number;
};

type PaymentRow = { payment_method: string; orders: number; revenue: number };
type HourRow = { hour: string; orders: number; revenue: number; tips?: number };
type XResp = { summary: Summary; by_payment: PaymentRow[]; by_hour: HourRow[] };
type ZPrevResp = { last_z: string | null; summary: Summary; by_payment: PaymentRow[] };
type ZCloseResp = { closed_at: string | null; since_last_z: string | null; summary: Summary; by_payment: PaymentRow[] };

export default function ReportsManager() {
  const [xData, setXData] = useState<XResp | null>(null);
  const [zPrev, setZPrev] = useState<ZPrevResp | null>(null);
  const [zClosed, setZClosed] = useState<ZCloseResp | null>(null);
  const [loadingX, setLoadingX] = useState(false);
  const [loadingZPrev, setLoadingZPrev] = useState(false);
  const [closingZ, setClosingZ] = useState(false);

  const loadX = async () => {
    setLoadingX(true);
    try {
      const res = await apiFetch("/api/reports/x");
      if (!res.ok) throw new Error("Failed to load X report");
      const json = await res.json();
      setXData(json);
    } catch (e: any) {
      toast.error(e.message || "Failed to load X report");
    } finally {
      setLoadingX(false);
    }
  };

  const previewZ = async () => {
    setLoadingZPrev(true);
    try {
      const res = await apiFetch("/api/reports/z/preview");
      if (!res.ok) throw new Error("Failed to preview Z report");
      setZPrev(await res.json());
    } catch (e: any) {
      toast.error(e.message || "Failed to preview Z report");
    } finally {
      setLoadingZPrev(false);
    }
  };

  const closeZ = async () => {
  if (!window.confirm("Run Z Report and close the day? This will reset the counter.")) return;

  setClosingZ(true);
  try {
        // ✅ Always make the API call, even if zClosed already exists
        const res = await apiFetch("/api/reports/z/close", { method: "POST" });
        const data = await res.json();

        // ✅ Handle backend refusal properly
        if (!res.ok || data.success === false || data.error) {
            toast.error(data.message || data.error || "Z-report already run today.");
            return;
        }

        // ✅ Successful close
        setZClosed(data);
        toast.success("Z Report closed");
    } catch (e: any) {
        toast.error(e.message || "Failed to close Z report");
    } finally {
        setClosingZ(false);
    }
  };



  const COLORS = ["#E91E63", "#3D5AFE", "#FFC107", "#4CAF50", "#FF5722"];

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-gray-800">Reports</h2>

      {/* X Report */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">X Report (Today)</h3>
          <button
            onClick={loadX}
            disabled={loadingX}
            className={`px-5 py-2 rounded-lg font-medium ${
              loadingX ? "bg-gray-400" : "bg-maroon hover:bg-red-800 text-white"
            }`}
          >
            {loadingX ? "Loading..." : "Generate X Report"}
          </button>
        </div>

        {loadingX ? (
          <Spinner />
        ) : xData ? (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-800 text-white p-4 rounded-xl">
                <p className="text-sm opacity-90">Total Orders</p>
                <p className="text-3xl font-bold">{xData.summary.total_orders ?? 0}</p>
              </div>
              <div className="bg-green-600 text-white p-4 rounded-xl">
                <p className="text-sm opacity-90">Revenue</p>
                <p className="text-3xl font-bold">
                  ${(xData.summary.total_revenue ?? 0).toFixed(2)}
                </p>
              </div>
              <div className="bg-blue-600 text-white p-4 rounded-xl">
                <p className="text-sm opacity-90">Tips</p>
                <p className="text-3xl font-bold">
                  ${(xData.summary.total_tips ?? 0).toFixed(2)}
                </p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
              {/* Pie Chart */}
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h4 className="text-lg font-semibold mb-4">Revenue by Payment Method</h4>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart margin={{ top: 30, right: 30, left: 30, bottom: 30 }}>
                    <Pie
                      data={xData.by_payment}
                      dataKey="revenue"
                      nameKey="payment_method"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={({ name, percent }: PieLabelRenderProps) => {
                        const pct = Number(percent ?? 0);
                        return `${name ?? ""}: ${(pct * 100).toFixed(1)}%`;
                      }}
                    >
                      {xData.by_payment.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Line Chart */}
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h4 className="text-lg font-semibold mb-4">Revenue and Tips by Hour</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={xData.by_hour}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#8B1A1A" strokeWidth={3} name="Revenue" />
                    <Line type="monotone" dataKey="tips" stroke="#2196F3" strokeWidth={3} name="Tips" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        ) : (
          <p className="text-gray-500 italic"></p>
        )}
      </div>

      {/* Z Report */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Z Report (Close Day)</h3>
          <div className="flex gap-3">
            <button
              onClick={previewZ}
              disabled={loadingZPrev}
              className={`px-4 py-2 rounded-lg font-medium ${
                loadingZPrev ? "bg-gray-400" : "bg-gray-700 hover:bg-black text-white"
              }`}
            >
              {loadingZPrev ? "Loading..." : "Preview"}
            </button>
            <button
                onClick={closeZ}
                disabled={
                    !!(
                    closingZ ||
                    (zClosed?.closed_at &&
                        new Date(zClosed.closed_at).toDateString() === new Date().toDateString())
                    )
                }
                className={`px-4 py-2 rounded-lg font-medium ${
                    closingZ ? "bg-gray-400" : "bg-red-700 hover:bg-red-800 text-white"
                }`}
            >
                {closingZ
                    ? "Closing..."
                    : zClosed?.closed_at &&
                        new Date(zClosed.closed_at).toDateString() === new Date().toDateString()
                    ? "Z Report Closed"
                    : "Run Z Report"}
            </button>
          </div>
        </div>

        {loadingZPrev ? (
          <Spinner />
        ) : zPrev ? (
          <>
            <p className="text-sm text-gray-600 mb-3">
                Since last Z:{" "}
                <span className="font-mono">
                    {zPrev.last_z
                        ? zPrev.last_z.replace("T", " ").split(".")[0]
                        : "N/A"}
                </span>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="bg-gray-800 text-white p-4 rounded-xl">
                <p className="text-sm opacity-90">Orders</p>
                <p className="text-3xl font-bold">{zPrev.summary.total_orders ?? 0}</p>
              </div>
              <div className="bg-green-600 text-white p-4 rounded-xl">
                <p className="text-sm opacity-90">Revenue</p>
                <p className="text-3xl font-bold">
                  ${(zPrev.summary.total_revenue ?? 0).toFixed(2)}
                </p>
              </div>
              <div className="bg-blue-600 text-white p-4 rounded-xl">
                <p className="text-sm opacity-90">Tips</p>
                <p className="text-3xl font-bold">
                  ${(zPrev.summary.total_tips ?? 0).toFixed(2)}
                </p>
              </div>
            </div>

            <h4 className="font-semibold mb-2">By Payment Method</h4>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-2 text-left">Method</th>
                    <th className="p-2 text-left">Orders</th>
                    <th className="p-2 text-left">Revenue</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {zPrev.by_payment.map((r, i) => (
                    <tr key={i}>
                      <td className="p-2">{r.payment_method}</td>
                      <td className="p-2">{r.orders}</td>
                      <td className="p-2">${r.revenue.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p className="text-gray-500 italic"></p>
        )}

        {zClosed && (
          <div className="mt-6 border-t pt-4">
            <h4 className="font-semibold mb-2">Z Closed</h4>
            <p className="text-sm text-gray-600 mb-2">
                Closed at:{" "}
                <span className="font-mono">
                    {zClosed.closed_at
                    ? zClosed.closed_at.replace("T", " ").split(".")[0]
                    : "N/A"}
                </span>{" "}
                (since{" "}
                {zClosed.since_last_z
                    ? zClosed.since_last_z.replace("T", " ").split(".")[0]
                    : "N/A"})
            </p>

            <ul className="list-disc ml-6">
              <li>Orders: {zClosed?.summary?.total_orders ?? 0}</li>
              <li>Revenue: ${(zClosed?.summary?.total_orders ?? 0).toFixed(2)}</li>
              <li>Tips: ${(zClosed?.summary?.total_orders ?? 0).toFixed(2)}</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
