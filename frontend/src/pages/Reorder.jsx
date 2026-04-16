import { useEffect, useState } from "react";
import { fetchReorder } from "../api";
import ReorderTable from "../components/ReorderTable";

export default function Reorder() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ store_id: "", action: "", product: "" });

  const loadData = async (params = {}) => {
    try {
      setLoading(true);
      setError("");
      const data = await fetchReorder(params);
      setRows(data);
    } catch (err) {
      setError(err?.response?.data?.detail || "Khong the tai du lieu nhap hang.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    const activeFilters = Object.fromEntries(
      Object.entries(filters).filter(([, value]) => String(value).trim().length > 0)
    );
    loadData(activeFilters);
  };

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Trung tam nhap hang</h2>

      <form
        onSubmit={handleSearch}
        className="grid gap-3 rounded-xl border border-slate-800 bg-slate-900 p-4 md:grid-cols-4"
      >
        <input
          value={filters.store_id}
          onChange={(e) => setFilters((prev) => ({ ...prev, store_id: e.target.value }))}
          placeholder="Loc theo cua hang (store_id)"
          className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
        />
        <input
          value={filters.product}
          onChange={(e) => setFilters((prev) => ({ ...prev, product: e.target.value }))}
          placeholder="Loc theo san pham"
          className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
        />
        <select
          value={filters.action}
          onChange={(e) => setFilters((prev) => ({ ...prev, action: e.target.value }))}
          className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm"
        >
          <option value="">Tat ca trang thai</option>
          <option value="REORDER">REORDER</option>
          <option value="NO_ACTION">NO_ACTION</option>
        </select>
        <button
          type="submit"
          className="rounded-md bg-brand-600 px-3 py-2 text-sm font-medium hover:bg-brand-500"
        >
          Tim kiem
        </button>
      </form>

      {loading && <div className="rounded-lg bg-slate-900 p-4 text-center">Dang tai du lieu...</div>}
      {error && <div className="rounded-lg border border-red-500 bg-red-500/10 p-4 text-red-300">{error}</div>}
      {!loading && !error && <ReorderTable rows={rows} />}
    </section>
  );
}
