import { Outlet } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";

function AdminLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-black">
      <AdminNavbar />

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;