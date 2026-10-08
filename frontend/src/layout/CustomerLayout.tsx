import { Outlet } from "react-router-dom";
import Navbar from "../components/layout/NavBar";

export default function CustomerLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main>
        <Outlet />
      </main>
    </div>
  );
}