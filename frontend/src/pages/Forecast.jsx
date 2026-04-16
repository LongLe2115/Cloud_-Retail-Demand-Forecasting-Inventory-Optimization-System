import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { fetchForecast, fetchReorder } from "../api";

export default function Forecast() {
  const [forecastData, setForecastData] = useState([]);
  const [reorderData, setReorderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");
        const [forecastRes, reorderRes] = await Promise.all([fetchForecast(), fetchReorder()]);
        setForecastData(forecastRes);
        setReorderData(reorderRes);
      } catch (err) {
        setError(err?.response?.data?.detail || "Khong the tai du lieu phan tich.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const topProducts = useMemo(() => {
    const accumulator = {};
    reorderData.forEach((item) => {
      accumulator[item.product] = (accumulator[item.product] || 0) + item.predicted_demand;
    });
    return Object.entries(accumulator)
      .map(([product, total]) => ({ product, total: Number(total.toFixed(2)) }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 8);
  }, [reorderData]);

  if (loading) {
    return <div className="rounded-lg bg-slate-900 p-6 text-center">Dang tai du lieu...</div>;
  }

  if (error) {
    return <div className="rounded-lg border border-red-500 bg-red-500/10 p-4 text-red-300">{error}</div>;
  }

  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold">Phan tich du bao</h2>

      <section className="rounded-xl border border-slate-800 bg-slate-900 p-4">
        <h3 className="mb-4 text-lg font-semibold">Predicted demand trend</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer>
            <LineChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b" }} />
              <Line
                type="monotone"
                dataKey="tong_predicted_demand"
                stroke="#14b8a6"
                strokeWidth={2}
                name="Nhu cau du bao"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900 p-4">
        <h3 className="mb-4 text-lg font-semibold">Sales vs Predicted</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer>
            <LineChart data={forecastData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b" }} />
              <Line type="monotone" dataKey="tong_sales" stroke="#3b82f6" strokeWidth={2} name="Tong sales" />
              <Line
                type="monotone"
                dataKey="tong_predicted_demand"
                stroke="#f59e0b"
                strokeWidth={2}
                name="Tong predicted"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900 p-4">
        <h3 className="mb-4 text-lg font-semibold">Top products theo nhu cau du bao</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer>
            <BarChart data={topProducts}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="product" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b" }} />
              <Bar dataKey="total" fill="#8b5cf6" name="Tong nhu cau du bao" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </section>
  );
}
