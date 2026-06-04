import { NavLink } from "react-router-dom";

const menus = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/reorder", label: "Trung tam nhap hang" },
  { to: "/forecast", label: "Phan tich du bao" },
  { to: "/monitoring", label: "Giam sat he thong" },
  { to: "/future-planning", label: "Ke hoach tuong lai" },
  { to: "/upload", label: "Upload Data" },
  { to: "/add-sale", label: "Add Sale" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-800 bg-slate-950/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6">
        <div>
          <p className="text-xs uppercase tracking-wide text-brand-500">
            Retail Forecast App
          </p>
          <h1 className="text-xl font-semibold text-slate-100">
            Bang dieu khien du bao nhu cau ban le
          </h1>
        </div>
        <nav className="flex flex-wrap gap-2">
          {menus.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm transition ${
                  isActive
                    ? "bg-brand-600 text-white"
                    : "bg-slate-900 text-slate-300 hover:bg-slate-800"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
