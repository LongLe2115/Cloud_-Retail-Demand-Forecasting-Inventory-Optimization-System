export default function ReorderTable({ rows }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900">
      <table className="min-w-full divide-y divide-slate-800">
        <thead className="bg-slate-800/60">
          <tr className="text-left text-sm uppercase tracking-wide text-slate-300">
            <th className="px-4 py-3">Ngay</th>
            <th className="px-4 py-3">Cua hang</th>
            <th className="px-4 py-3">San pham</th>
            <th className="px-4 py-3">Nhu cau du bao</th>
            <th className="px-4 py-3">Diem nhap lai</th>
            <th className="px-4 py-3">Trang thai</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800 text-sm text-slate-200">
          {rows.map((row, idx) => (
            <tr key={`${row.store_id}-${row.product}-${idx}`} className="hover:bg-slate-800/50">
              <td className="px-4 py-3">{row.date}</td>
              <td className="px-4 py-3">{row.store_id}</td>
              <td className="px-4 py-3">{row.product}</td>
              <td className="px-4 py-3">{row.predicted_demand.toFixed(2)}</td>
              <td className="px-4 py-3">{row.reorder_point.toFixed(2)}</td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-2 py-1 text-xs font-semibold ${
                    row.action === "REORDER"
                      ? "bg-amber-500/20 text-amber-300"
                      : "bg-emerald-500/20 text-emerald-300"
                  }`}
                >
                  {row.action}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
