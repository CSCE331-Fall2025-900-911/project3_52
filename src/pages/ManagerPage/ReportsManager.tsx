import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import Spinner from "../../components/Spinner";
import { apiFetch } from "../../api/http";
import Modal from "../../components/Modal";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import type { PieLabelRenderProps } from "recharts";

type Summary = {
  total_orders?: number;
  total_revenue?: number;
  total_tips?: number;
};

type PaymentRow = { payment_method: string; orders: number; revenue: number };
type HourRow = { hour: string; orders: number; revenue: number; tips?: number };
type XResp = {
  summary: Summary;
  by_payment: PaymentRow[];
  by_hour: HourRow[];
  start_time?: string;
};
type ZPrevResp = {
  last_z: string | null;
  summary: Summary;
  by_payment: PaymentRow[];
};
type ZCloseResp = {
  closed_at: string | null;
  since_last_z: string | null;
  summary: Summary;
  by_payment: PaymentRow[];
};

export default function ReportsManager() {
  const [xData, setXData] = useState<XResp | null>(null);
  const [zPrev, setZPrev] = useState<ZPrevResp | null>(null);
  const [zClosed, setZClosed] = useState<ZCloseResp | null>(null);
  const [loadingX, setLoadingX] = useState(false);
  const [loadingZPrev, setLoadingZPrev] = useState(false);
  const [closingZ] = useState(false);
  const [confirmZOpen, setConfirmZOpen] = useState(false);
  const [isRunningZ, setIsRunningZ] = useState(false);
  const [zClosedToday, setZClosedToday] = useState(false);
  const [zClosedStatus, setZClosedStatus] = useState<{
    closed_at?: string | null;
  } | null>(null);

  useEffect(() => {
    checkZClosedToday();
  }, []);

  useEffect(() => {
    if (zClosed) {
      window.print();
    }
  }, [zClosed]);

  const checkZClosedToday = async () => {
    try {
      const res = await apiFetch("/api/reports/z/status");
      if (!res.ok) throw new Error("Failed to fetch Z report status");
      const data = await res.json();
      setZClosedToday(data.z_closed_today === true);
      setZClosedStatus(data);
    } catch (e: any) {
      toast.error(e.message || "Failed to fetch Z report status");
    }
  };

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
    setXData(null);
    setZPrev(null);
    setConfirmZOpen(true); // <-- OPEN CUSTOM MODAL
  };
  const runZReport = async () => {
  setIsRunningZ(true);
  try {
    const res = await apiFetch("/api/reports/z/close", { method: "POST" });
    const data = await res.json();

    if (!res.ok || data.success === false || data.error) {
      toast.error(data.message || data.error || "Z-report already run today.");
      return;
    }

    setZClosed(data);
    setZClosedToday(true);
    toast.success("Z Report closed");
  } catch (e: any) {
    toast.error(e.message || "Failed to close Z report");
  } finally {
    setIsRunningZ(false);
    setConfirmZOpen(false); // CLOSE MODAL
  }
};

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
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
        X/Z Reports
      </h2>

      {/* X Report */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
          <h3 className="text-xl font-semibold">X Report</h3>
          <button
            onClick={loadX}
            disabled={xData !== null || loadingX}
            className={`min-w-[8rem]  px-5 py-2 rounded-lg font-medium ${
              loadingX
                ? "opacity-50 bg-gray-200"
                : "bg-maroon hover:bg-darkmaroon text-white disabled:opacity-50"
            }`}
          >
            {loadingX ? "Loading..." : "Generate"}
          </button>
        </div>

        {loadingX ? (
          <Spinner />
        ) : xData ? (
          <>
            <p className="text-sm text-gray-600 mb-3">
              Since:{" "}
              {xData.start_time
                ? new Date(xData.start_time).toLocaleString([], {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  }) + " Today"
                : "N/A"}
            </p>
            {/* KPI Cards */}
            <div
              id="xReport"
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 print:w-[80mm] print:leading-tight"
            >
              <div 
                style={{ backgroundColor: COLORS[0] }}
                className="bg-gray-800 text-white p-4 rounded-xl"
              >
                <p className="text-sm opacity-90">Total Orders</p>
                <p className="text-2xl sm:text-3xl font-bold">
                  {xData.summary.total_orders ?? 0}
                </p>
              </div>
              <div 
                style={{ backgroundColor: COLORS[1] }}
                className="bg-gray-800 text-white p-4 rounded-xl"
              >
                <p className="text-sm opacity-90">Revenue</p>
                <p className="text-2xl sm:text-3xl font-bold">
                  ${(xData.summary.total_revenue ?? 0).toFixed(2)}
                </p>
              </div>
              <div 
                style={{ backgroundColor: COLORS[3] }}
                className="bg-gray-800 text-white p-4 rounded-xl"
              >
                <p className="text-sm opacity-90">Tips</p>
                <p className="text-2xl sm:text-3xl font-bold">
                  ${(xData.summary.total_tips ?? 0).toFixed(2)}
                </p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
              {/* Pie Chart */}
              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
                <h4 className="text-lg font-semibold mb-4">
                  Revenue by Payment Method
                </h4>
                <ResponsiveContainer
                  width="100%"
                  height={window.innerWidth < 1024 ? 300 : 350}
                >
                  <PieChart
                    margin={{ top: 30, right: 30, left: 30, bottom: 30 }}
                  >
                    <Pie
                      data={xData.by_payment}
                      dataKey="revenue"
                      nameKey="payment_method"
                      cx="50%"
                      cy="50%"
                      outerRadius={window.innerWidth < 1024 ? 80 : 100}
                      label={({ name, percent }: PieLabelRenderProps) => {
                        const pct = Number(percent ?? 0);
                        return `${name ?? ""}: ${(pct * 100).toFixed(1)}%`;
                      }}
                    >
                      {xData.by_payment.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[(index+3) % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => `$${value.toFixed(2)}`}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Line Chart */}
              <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
                <h4 className="text-lg font-semibold mb-4">
                  Revenue and Tips by Hour
                </h4>
                <ResponsiveContainer
                  width="100%"
                  height={window.innerWidth < 1024 ? 250 : 300}
                >
                  <LineChart data={xData.by_hour}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number) => `$${value.toFixed(2)}`}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#8B1A1A"
                      strokeWidth={3}
                      name="Revenue"
                    />
                    <Line
                      type="monotone"
                      dataKey="tips"
                      stroke="#2196F3"
                      strokeWidth={3}
                      name="Tips"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>

      {/* Z Report */}
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
          <h3 className="text-xl font-semibold">Z Report</h3>
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={previewZ}
              disabled={loadingZPrev || zPrev !== null || zClosedToday}
              className={`min-w-[8rem] px-4 py-2 rounded-lg font-medium ${
                loadingZPrev
                  ? "bg-gray-200 ocapacity-50"
                  : "bg-white text-darkmaroon hover:bg-gray-100 border border-darkmaroon disabled:opacity-50"
              }`}
            >
              {loadingZPrev ? "Loading..." : "Preview"}
            </button>
            <button
              onClick={closeZ}
              disabled={closingZ || zClosedToday}
              className={`min-w-[8rem] px-4 py-2 rounded-lg font-medium ${
                closingZ || zClosedToday
                  ? "opacity-50 bg-gray-200"
                  : "bg-maroon hover:bg-darkmaroon text-white disabled:opacity-50"
              }`}
            >
              {closingZ ? "Closing..." : zClosedToday ? "Closed" : "Generate"}
            </button>
          </div>
        </div>

        {zClosedToday && (
          <p className="text-sm text-gray-500 font-semibold mb-3">
            {zClosedStatus?.closed_at
              ? `Z Report has been closed today at ${new Date(
                  zClosedStatus.closed_at
                ).toLocaleTimeString([], {
                  hour: "numeric",
                  minute: "2-digit",
                })}`
              : ""}
          </p>
        )}

        {loadingZPrev ? (
          <Spinner />
        ) : zPrev && !zClosed ? (
          <>
            <p className="text-sm text-gray-600 mb-3">
              Since Last Z:{" "}
              {zPrev.last_z
                ? new Date(zPrev.last_z).toLocaleString([], {
                    month: "2-digit",
                    day: "2-digit",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })
                : "N/A"}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="bg-gray-800 text-white p-4 rounded-xl">
                <p className="text-sm opacity-90">Orders</p>
                <p className="text-2xl sm:text-3xl font-bold">
                  {zPrev.summary.total_orders ?? 0}
                </p>
              </div>
              <div className="bg-green-600 text-white p-4 rounded-xl">
                <p className="text-sm opacity-90">Revenue</p>
                <p className="text-2xl sm:text-3xl font-bold">
                  ${(zPrev.summary.total_revenue ?? 0).toFixed(2)}
                </p>
              </div>
              <div className="bg-blue-600 text-white p-4 rounded-xl">
                <p className="text-sm opacity-90">Tips</p>
                <p className="text-2xl sm:text-3xl font-bold">
                  ${(zPrev.summary.total_tips ?? 0).toFixed(2)}
                </p>
              </div>
            </div>

            <h4 className="font-semibold mb-2">By Payment Method</h4>
            <div className="overflow-x-auto">
              <table className="w-full min-w-full">
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
          <></>
        )}

        {zClosed && (
          <>
            <div
              id="zReport"
              className="font-mono border-t-2 pt-6 text-sm print:w-[80mm] print:leading-tight"
            >
              <h4 className="font-semibold mb-2">Z Report</h4>
              <p className="text-sm text-gray-600 mb-2">
                Closed at:{" "}
                <span className="font-mono">
                  {zClosed.closed_at
                    ? new Date(zClosed.closed_at).toLocaleString([], {
                        month: "2-digit",
                        day: "2-digit",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })
                    : "N/A"}
                </span>{" "}
                (since{" "}
                {zClosed.since_last_z
                  ? new Date(zClosed.since_last_z).toLocaleString([], {
                      month: "2-digit",
                      day: "2-digit",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                      hour12: true,
                    })
                  : "N/A"}
                )
              </p>

              <ul className="list-disc ml-6">
                <li>Orders: {zClosed?.summary?.total_orders ?? 0}</li>
                <li>
                  Revenue: ${(zClosed?.summary?.total_revenue ?? 0).toFixed(2)}
                </li>
                <li>Tips: ${(zClosed?.summary?.total_tips ?? 0).toFixed(2)}</li>
              </ul>

              {/* Revenue by Payment Method */}
              <h5 className="font-semibold mt-6 mb-2">
                Revenue by Payment Method
              </h5>
              <div className="overflow-x-auto">
                <table className="w-full min-w-full text-xs print:text-xs">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-2 text-left">Method</th>
                      <th className="p-2 text-left">Orders</th>
                      <th className="p-2 text-left">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {zClosed.by_payment.map((r, i) => (
                      <tr key={i}>
                        <td className="p-2">{r.payment_method}</td>
                        <td className="p-2">{r.orders}</td>
                        <td className="p-2">${r.revenue.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <button
              onClick={() => window.print()}
              className="mt-4 px-4 py-2 bg-maroon text-white rounded-lg hover:bg-darkmaroon"
            >
              Print
            </button>
          </>
        )}
      </div>
      <Modal
        isOpen={confirmZOpen}
        onClose={() => setConfirmZOpen(false)}
        title="Generate Z Report?"
      >
        <p className="text-gray-700 mb-4">
            Generating a Z Report will <span className="font-semibold">close the
            business day</span>, reset X-report totals, and archive today's
            sales.
            <br /><br />
            This action <span className="font-bold text-red-600">cannot be undone</span>.
            Are you sure you want to continue?
        </p>

        <div className="flex justify-end gap-3">
            <button
            onClick={() => setConfirmZOpen(false)}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg"
            >
            Cancel
            </button>

            <button
            onClick={runZReport}
            disabled={isRunningZ}
            className="px-4 py-2 bg-maroon text-white rounded-lg hover:bg-darkmaroon disabled:opacity-50"
            >
            {isRunningZ ? "Processing..." : "Confirm"}
            </button>
        </div>
      </Modal>
    </div>
  );
}
