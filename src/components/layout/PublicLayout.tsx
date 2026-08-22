import { Outlet } from "react-router-dom";
import Navbar from "../Navbar";

function PublicLayout() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Navbar />

      <Outlet />
    </div>
  );
}

export default PublicLayout;