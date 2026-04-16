import { useEffect, useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import DemandChart from "../components/DemandChart";
import StatCard from "../components/StatCard";
import { fetchForecast, fetchReorder, fetchStats } from "../api";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [reorderData, setReorderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");
        const [statsRes, forecastRes, reorderRes] = await Promise.all([
          fetchStats(),
          fetchForecast(),
          fetchReorder(),
        ]);
        setStats(statsRes);
        setForecastData(forecastRes);
        setReorderData(reorderRes);
      } catch (err) {
        setError(err?.response?.data?.detail || "Khong the tai du lieu dashboard.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const reorderSummary = useMemo(() => {
    const grouped = {};
    reorderData.forEach((item) => {
      grouped[item.action] = (grouped[item.action] || 0) + 1;
    });
    return Object.entries(grouped).map(([action, total]) => ({ action, total }));
  }, [reorderData]);

  if (loading) {
    return <div className="rounded-lg bg-slate-900 p-6 text-center">Dang tai du lieu...</div>;
  }

  if (error) {
    return <div className="rounded-lg border border-red-500 bg-red-500/10 p-4 text-red-300">{error}</div>;
  }

  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Tong ban ghi" value={stats?.tong_ban_ghi?.toLocaleString("vi-VN") || 0} />
        <StatCard title="Tong can nhap hang" value={stats?.tong_reorder?.toLocaleString("vi-VN") || 0} accent="text-amber-400" />
        <StatCard title="Nhu cau trung binh" value={stats?.nhu_cau_trung_binh?.toLocaleString("vi-VN") || 0} />
        <StatCard title="So cua hang" value={stats?.so_cua_hang?.toLocaleString("vi-VN") || 0} accent="text-sky-400" />
      </div>

      <DemandChart data={forecastData} title="Xu huong nhu cau du bao va doanh so theo ngay" />

      <section className="rounded-xl border border-slate-800 bg-slate-900 p-4">
        <h3 className="mb-4 text-lg font-semibold">Tong reorder theo hanh dong</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer>
            <BarChart data={reorderSummary}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="action" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b" }} />
              <Bar dataKey="total" fill="#14b8a6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </section>
  );
}
