export default function StatCard({ title, value, accent = "text-brand-500" }) {
  return (
    <article className="rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-lg shadow-black/20">
      <p className="text-sm text-slate-400">{title}</p>
      <p className={`mt-2 text-2xl font-semibold ${accent}`}>{value}</p>
    </article>
  );
}
