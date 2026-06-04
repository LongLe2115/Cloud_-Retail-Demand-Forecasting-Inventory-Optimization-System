import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Forecast from "./pages/Forecast";
import Reorder from "./pages/Reorder";
import Monitoring from "./pages/Monitoring";
import FuturePlanning from "./pages/FuturePlanning";
import DataUpload from "./pages/DataUpload";
import AddSale from "./pages/AddSale";


export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-8 pt-4 md:px-6">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route path="/dashboard" element={<Dashboard />} />

          <Route path="/reorder" element={<Reorder />} />

          <Route path="/forecast" element={<Forecast />} />

          <Route path="/monitoring" element={<Monitoring />} />

          <Route path="/future-planning" element={<FuturePlanning />} />

          <Route path="/upload" element={<DataUpload />} />
          
          <Route path="/add-sale" element={<AddSale />} />
        </Routes>
      </main>
    </div>
  );
}
