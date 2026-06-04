import { useEffect, useState } from "react";
import axios from "axios";

export default function Monitoring() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const successRate =
  data?.history?.length > 0
    ? (
        data.history.filter(
          (x) => x.status === "SUCCESS"
        ).length /
        data.history.length
      ) * 100
    : 0;

  useEffect(() => {

    const loadData = () => {
      axios
        .get("http://127.0.0.1:8000/api/monitoring")
        .then((res) => {
          setData(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    };

    loadData();

    const interval = setInterval(
      loadData,
      30000
    );

    return () => clearInterval(interval);

  }, []);

  if (loading) {
    return (
      <div className="text-white text-xl">
        Loading monitoring data...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-red-400 text-xl">
        Failed to load monitoring data
      </div>
    );
  }

  return (
    <div className="space-y-6">

  <div>
    <h2 className="text-3xl font-bold text-white">
      Monitoring Dashboard
    </h2>

    <p className="text-slate-400">
      Real-time Pipeline Health Monitoring
    </p>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-6 gap-4">

    <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
      <p className="text-slate-400 mb-2">
        Pipeline Status
      </p>

      <h3
        className={`text-2xl font-bold ${
          data.status === "SUCCESS"
            ? "text-green-400"
            : data.status === "FAILED"
            ? "text-red-400"
            : "text-yellow-400"
        }`}
      >
        {data.status}
      </h3>
    </div>

    <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
      <p className="text-slate-400 mb-2">
        Last Run
      </p>

      <h3 className="text-cyan-400 text-sm break-all">
        {data.run_time}
      </h3>
    </div>

    <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
      <p className="text-slate-400 mb-2">
        Rows Processed
      </p>

      <h3 className="text-yellow-400 text-2xl font-bold">
        {data.rows_processed?.toLocaleString()}
      </h3>
    </div>

    <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
      <p className="text-slate-400 mb-2">
        Model Version
      </p>

      <h3 className="text-purple-400 text-2xl font-bold">
        {data.model_version}
      </h3>
    </div>

    <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
      <p className="text-slate-400 mb-2">
        Duration
      </p>

      <h3 className="text-orange-400 text-2xl font-bold">
        {data.duration_seconds}s
      </h3>
    </div>

    <div className="bg-slate-900 rounded-xl p-5 border border-slate-800">
      <p className="text-slate-400 mb-2">
        Success Rate
      </p>

      <h3 className="text-green-400 text-2xl font-bold">
        {successRate.toFixed(0)}%
      </h3>
    </div>

  </div>

  <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">

    <h3 className="text-xl font-semibold mb-4">
      Pipeline Information
    </h3>

    <div className="space-y-3 text-slate-300">

      <p>
        <span className="font-semibold text-white">
          Pipeline:
        </span>{" "}
        {data.pipeline_name}
      </p>

      <p>
        <span className="font-semibold text-white">
          Last Status:
        </span>{" "}
        {data.status}
      </p>

      <p>
        <span className="font-semibold text-white">
          Model Version:
        </span>{" "}
        {data.model_version}
      </p>

      <p>
        <span className="font-semibold text-white">
          Rows Processed:
        </span>{" "}
        {data.rows_processed?.toLocaleString()}
      </p>

      <p>
        <span className="font-semibold text-white">
          Duration:
        </span>{" "}
        {data.duration_seconds} seconds
      </p>

      <p>
        <span className="font-semibold text-white">
          Auto Refresh:
        </span>{" "}
        Every 30 seconds
      </p>

    </div>

  </div>

  <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">

    <h3 className="text-xl font-semibold mb-4">
      Recent Pipeline Runs
    </h3>

    <div className="overflow-x-auto">

      <table className="min-w-full">

        <thead>

          <tr className="border-b border-slate-700">

            <th className="p-3 text-left">
              Run Time
            </th>

            <th className="p-3 text-left">
              Status
            </th>

            <th className="p-3 text-left">
              Rows
            </th>

            <th className="p-3 text-left">
              Duration
            </th>

          </tr>

        </thead>

        <tbody>

          {data.history?.map((run, idx) => (

            <tr
              key={idx}
              className="border-b border-slate-800"
            >

              <td className="p-3">
                {run.run_time}
              </td>

              <td className="p-3">

                <span
                  className={
                    run.status === "SUCCESS"
                      ? "text-green-400"
                      : "text-red-400"
                  }
                >
                  {run.status}
                </span>

              </td>

              <td className="p-3">
                {run.rows_processed?.toLocaleString()}
              </td>

              <td className="p-3">
                {run.duration_seconds}s
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