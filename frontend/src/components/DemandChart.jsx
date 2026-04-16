import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function DemandChart({ data, title }) {
  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <h3 className="mb-4 text-lg font-semibold text-slate-100">{title}</h3>
      <div className="h-80 w-full">
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="date" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b" }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="tong_predicted_demand"
              stroke="#14b8a6"
              strokeWidth={2}
              name="Tong nhu cau du bao"
            />
            <Line
              type="monotone"
              dataKey="tong_sales"
              stroke="#f59e0b"
              strokeWidth={2}
              name="Tong doanh so"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
