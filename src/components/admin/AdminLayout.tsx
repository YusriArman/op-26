import { Outlet } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";

function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <AdminNavbar />

      <Outlet />
    </div>
  );
}

export default AdminLayout;