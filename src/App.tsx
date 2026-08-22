import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import PublicLayout from "./components/layout/PublicLayout";
import AdminLayout from "./components/layout/AdminLayout";

import Home from "./pages/Home";
import Faq from "./pages/Faq";
import Prize from "./pages/Prizes";

import Login from "./pages/admin/Admin";
import Dashboard from "./pages/admin/Dashboard";
import Regi from "./pages/admin/Regi";
import Binding from "./pages/admin/Binding";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Website */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/prizes" element={<Prize />} />
        </Route>

        {/* Admin Login */}
        <Route path="/login" element={<Login />} />

        {/* Admin Website */}
        <Route element={<AdminLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/registration" element={<Regi />} />
          <Route path="/binding" element={<Binding />} />
        </Route>

        {/* 404 */}
        <Route
          path="*"
          element={
            <main className="flex min-h-screen items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold">
                  404
                </h1>

                <p className="mt-2 text-gray-600">
                  Page not found.
                </p>
              </div>
            </main>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;