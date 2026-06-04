import { useEffect, useMemo, useState } from "react";
import StatCard from "../components/StatCard";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
  import {
  BarChart,
  Bar
} from "recharts";
export default function FuturePlanning() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const [storeId, setStoreId] = useState("");
  const [product, setProduct] = useState("");
  const [riskLevel, setRiskLevel] = useState("");

  const [refreshing, setRefreshing] = useState(false);
  
  const [runId, setRunId] = useState(null);
  const [jobStatus, setJobStatus] = useState(null);
  const loadData = () => {
  const params = new URLSearchParams();

    if (storeId) params.append("store_id", storeId);
    if (product) params.append("product", product);
    if (riskLevel) params.append("risk_level", riskLevel);

    setLoading(true);

    fetch(
      `http://127.0.0.1:8000/api/future-forecast?${params.toString()}`
    )
      .then((r) => r.json())
      .then((data) => {
        setRows(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const refreshForecast = async () => {
    try {
      setRefreshing(true);

      const res = await fetch(
        "http://127.0.0.1:8000/api/refresh-forecast",
        {
          method: "POST"
        }
      );

      const data = await res.json();

      setRunId(data.run_id);

      setJobStatus({
        run_id: data.run_id,
        life_cycle_state: "PENDING",
        result_state: null
      });

      alert(
        `✅ Pipeline Started\nRun ID: ${data.run_id}`
      );

    } catch (err) {

      console.error(err);

      alert(
        "❌ Cannot start forecast pipeline"
      );

    } finally {

      setRefreshing(false);

    }
  };

  useEffect(() => {

    if (!runId) return;

    const timer = setInterval(async () => {

      try {

        const res = await fetch(
          `http://127.0.0.1:8000/api/job-status/${runId}`
        );

        const data = await res.json();

        setJobStatus(data);

        if (
          data.life_cycle_state === "TERMINATED"
        ) {

          clearInterval(timer);

          loadData();

        }

      } catch (err) {

        console.error(err);

      }

    }, 5000);

    return () => clearInterval(timer);

  }, [runId]);
  useEffect(() => {
  loadData();
}, []);
  const stats = useMemo(() => {

    const high = rows.filter(
      (x) => x.risk_level === "HIGH"
    ).length;

    const medium = rows.filter(
      (x) => x.risk_level === "MEDIUM"
    ).length;

    const low = rows.filter(
      (x) => x.risk_level === "LOW"
    ).length;

    return {
      total: rows.length,
      high,
      medium,
      low,
    };

  }, [rows]);
  const trendData = useMemo(() => {

  const grouped = {};

  rows.forEach((row) => {

    if (!grouped[row.forecast_date]) {
      grouped[row.forecast_date] = 0;
    }

    grouped[row.forecast_date] +=
      Number(row.predicted_demand);

  });

  return Object.entries(grouped)
    .map(([date, demand]) => ({
      date,
      demand: Number(demand.toFixed(0))
    }))
    .slice(0, 30);

}, [rows]);
  const topProducts = useMemo(() => {

  const grouped = {};

  rows.forEach((row) => {

    if (!grouped[row.product]) {
      grouped[row.product] = 0;
    }

    grouped[row.product] += Number(
      row.predicted_demand
    );

  });

  return Object.entries(grouped)
    .map(([product, demand]) => ({
      product,
      demand: Number(demand.toFixed(0))
    }))
    .sort((a, b) => b.demand - a.demand)
    .slice(0, 10);

}, [rows]);
  const riskData = [
  {
    name: "HIGH",
    value: stats.high
  },
  {
    name: "MEDIUM",
    value: stats.medium
  },
  {
    name: "LOW",
    value: stats.low
  }
];
  if (loading) {
    return (
      <div className="text-white text-xl">
        Loading future forecast...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div>
        <h2 className="text-2xl font-bold">
          Future Planning Dashboard
        </h2>

        <p className="text-slate-400">
          Demand Forecast & Inventory Planning
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          title="Forecast Records"
          value={stats.total}
        />

        <StatCard
          title="High Risk"
          value={stats.high}
        />

        <StatCard
          title="Medium Risk"
          value={stats.medium}
        />

        <StatCard
          title="Low Risk"
          value={stats.low}
        />
      </div>

      <div className="flex flex-wrap gap-3 rounded-xl border border-slate-800 bg-slate-900 p-4">

        <input
          type="text"
          placeholder="Store ID"
          value={storeId}
          onChange={(e) =>
            setStoreId(e.target.value)
          }
          className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2"
        />

        <input
          type="text"
          placeholder="Product"
          value={product}
          onChange={(e) =>
            setProduct(e.target.value)
          }
          className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2"
        />

        <select
          value={riskLevel}
          onChange={(e) =>
            setRiskLevel(e.target.value)
          }
          className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2"
        >
          <option value="">
            All Risk
          </option>

          <option value="HIGH">
            HIGH
          </option>

          <option value="MEDIUM">
            MEDIUM
          </option>

          <option value="LOW">
            LOW
          </option>
        </select>

        <button
          onClick={loadData}
          className="rounded-lg bg-blue-600 px-4 py-2 font-medium hover:bg-blue-700"
        >
          Filter
        </button>

        <button
          onClick={refreshForecast}
          disabled={refreshing}
          className="rounded-lg bg-green-600 px-4 py-2 font-medium hover:bg-green-700 disabled:opacity-50"
        >
          {refreshing
            ? "Starting..."
            : "Refresh Forecast"}
        </button>

            </div>

      {jobStatus && (

    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">

      <div className="flex flex-wrap gap-8">

        <div>
          <p className="text-slate-400 text-sm">
            Run ID
          </p>

          <p className="font-semibold">
            {jobStatus.run_id}
          </p>
        </div>

        <div>
          <p className="text-slate-400 text-sm">
            Status
          </p>

          <p className="font-semibold">

            {jobStatus.life_cycle_state === "RUNNING" &&
              "🟡 RUNNING"}

            {jobStatus.life_cycle_state === "PENDING" &&
              "🟠 PENDING"}

            {jobStatus.life_cycle_state === "TERMINATED" &&
              "🟢 TERMINATED"}

          </p>
        </div>

        <div>
          <p className="text-slate-400 text-sm">
            Result
          </p>

          <p className="font-semibold">
            {jobStatus.result_state === "SUCCESS"
              ? "✅ SUCCESS"
              : jobStatus.result_state || "-"}
          </p>
        </div>

        <div>
          <p className="text-slate-400 text-sm">
            Duration
          </p>

          <p className="font-semibold">
            {jobStatus.duration_seconds
              ? `${Math.floor(
                  jobStatus.duration_seconds / 60
                )}m ${
                  jobStatus.duration_seconds % 60
                }s`
              : "-"}
          </p>
        </div>

      </div>

    </div>

  )}
      {/* Forecast Trend */}

<div className="rounded-xl border border-slate-800 bg-slate-900 p-4">

  <h3 className="mb-4 text-lg font-semibold">
    Forecast Trend
  </h3>

  <ResponsiveContainer
    width="100%"
    height={300}
  >

    <LineChart data={trendData}>

      <CartesianGrid strokeDasharray="3 3" />

      <XAxis dataKey="date" />

      <YAxis />

      <Tooltip
        contentStyle={{
          backgroundColor: "#ffffff",
          border: "1px solid #ccc"
        }}
        labelStyle={{
          color: "#000000",
          fontWeight: "bold"
        }}
        itemStyle={{
          color: "#000000",
          fontWeight: "bold"
        }}
      />

      <Line
        type="monotone"
        dataKey="demand"
      />

    </LineChart>

  </ResponsiveContainer>

</div>

{/* Analytics */}

<div className="grid gap-6 lg:grid-cols-2">

  <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">

    <h3 className="mb-4 text-lg font-semibold">
      Top Demand Products
    </h3>

    <ResponsiveContainer
      width="100%"
      height={350}
    >

      <BarChart data={topProducts}>

        <CartesianGrid strokeDasharray="3 3" />

        <XAxis
            dataKey="product"
            tick={{
              fill: "#fefefe",
              fontSize: 12,
              fontWeight: 600
            }}
          />

        <YAxis
          tick={{
            fill: "#ffffff"
          }}
        />
              <Tooltip
        contentStyle={{
          backgroundColor: "#ffffff",
          border: "1px solid #ccc"
        }}
        labelStyle={{
          color: "  #000000",
          fontWeight: "bold"
        }}
        itemStyle={{
          color: "#000000",
          fontWeight: "bold"
        }}
      />
        <Tooltip />

        <Bar dataKey="demand" 
             fill = "#06b6d4"/>

      </BarChart>

    </ResponsiveContainer>

  </div>

  <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">

    <h3 className="mb-4 text-lg font-semibold">
      Risk Distribution
    </h3>

    <div className="space-y-4">

      <div className="flex justify-between">
        <span>HIGH</span>
        <span>{stats.high}</span>
      </div>

      <div className="flex justify-between">
        <span>MEDIUM</span>
        <span>{stats.medium}</span>
      </div>

      <div className="flex justify-between">
        <span>LOW</span>
        <span>{stats.low}</span>
      </div>

    </div>

  </div>

</div>

        <table className="min-w-full">

          <thead>
            <tr className="border-b border-slate-700">

              <th className="p-3 text-left">
                Date
              </th>

              <th className="p-3 text-left">
                Store
              </th>

              <th className="p-3 text-left">
                Product
              </th>

              <th className="p-3 text-left">
                Demand
              </th>

              <th className="p-3 text-left">
                Recommended Qty
              </th>

              <th className="p-3 text-left">
                Risk
              </th>

              <th className="p-3 text-left">
                Action
              </th>

            </tr>
          </thead>

          <tbody>

            {rows.slice(0, 200).map(
              (row, idx) => (
                <tr
                  key={idx}
                  className="border-b border-slate-800"
                >

                  <td className="p-3">
                    {row.forecast_date}
                  </td>

                  <td className="p-3">
                    {row.store_id}
                  </td>

                  <td className="p-3">
                    {row.product}
                  </td>

                  <td className="p-3">
                    {Number(
                      row.predicted_demand
                    ).toFixed(2)}
                  </td>

                  <td className="p-3">
                    {Number(
                      row.recommended_order_qty
                    ).toFixed(2)}
                  </td>

                  <td className="p-3">
                    {row.risk_level}
                  </td>

                  <td className="p-3">
                    {row.action}
                  </td>

                </tr>
              )
            )}

          </tbody>

        </table>

      </div>
  );
}