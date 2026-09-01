import { Outlet } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";

function AdminLayout() {
  return (
    <div className="bg-gradient-admin admin-scrollbar flex min-h-screen flex-col">
      <AdminNavbar />

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;