import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import PublicLayout from "./components/public/PublicLayout";
import AdminLayout from "./components/admin/AdminLayout";
import ProtectedRoute from "./components/admin/ProtectedRoute";

import Queue from "./pages/Home";
import FAQ from "./pages/Faq";
import Prizes from "./pages/Prizes";

import Login from "./pages/admin/Admin";
import Dashboard from "./pages/admin/Dashboard";
import Registration from "./pages/admin/Regi";
import Binding from "./pages/admin/Binding";
import Day1Binding from "./pages/admin/Day1Binding";
import Day2Binding from "./pages/admin/Day2Binding";
import WaitlistBinding from "./pages/admin/WaitlistBinding";
import AttendedStudents from "./pages/admin/AttendedStudents";
import Database from "./pages/admin/Database";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ========================= */}
        {/* PUBLIC */}
        {/* ========================= */}

        <Route element={<PublicLayout />}>

          <Route
            path="/"
            element={<Queue />}
          />

          <Route
            path="/faq"
            element={<FAQ />}
          />

          <Route
            path="/prizes"
            element={<Prizes />}
          />

        </Route>


        {/* ========================= */}
        {/* LOGIN */}
        {/* ========================= */}

        <Route
          path="/login"
          element={<Login />}
        />


        {/* ========================= */}
        {/* PROTECTED ADMIN */}
        {/* ========================= */}

        <Route element={<ProtectedRoute />}>

          <Route element={<AdminLayout />}>

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

            <Route
              path="/binding/day-1"
              element={<Day1Binding />}
            />

            <Route
              path="/binding/day-2"
              element={<Day2Binding />}
            />

            <Route
              path="/binding/waitlist"
              element={<WaitlistBinding />}
            />

            <Route
              path="/attended"
              element={<AttendedStudents />}
            />

            <Route
              path="/database"
              element={<Database />}
            />

          </Route>

        </Route>


        {/* ========================= */}
        {/* 404 */}
        {/* ========================= */}

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