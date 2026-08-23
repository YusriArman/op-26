import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import PublicLayout from "./components/public/PublicLayout";

import Queue from "./pages/Home";
import FAQ from "./pages/Faq";
import Prizes from "./pages/Prizes";

import Login from "./pages/admin/Admin";
import Dashboard from "./pages/admin/Dashboard";
import Registration from "./pages/admin/Regi";
import Binding from "./pages/admin/Binding";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Website */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Queue />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/prizes" element={<Prizes />} />
        </Route>

        {/* Admin Login */}
        <Route path="/login" element={<Login />} />

        {/* Admin routes - protected later */}
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        <Route
          path="/registration"
          element={<Registration />}
        />

        <Route
          path="/binding"
          element={<Binding />}
        />

        {/* 404 */}
        <Route
          path="*"
          element={
            <div className="flex min-h-screen items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold">
                  404
                </h1>

                <p className="mt-2 text-gray-500">
                  Page not found.
                </p>
              </div>
            </div>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;