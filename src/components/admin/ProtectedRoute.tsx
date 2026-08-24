import {
  Navigate,
  Outlet,
} from "react-router-dom";

import { useAuth } from "../../context/UseAuth";

function ProtectedRoute() {
  const {
    session,
    loading,
  } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">
          Checking authentication...
        </p>
      </div>
    );
  }

  if (!session) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return <Outlet />;
}

export default ProtectedRoute;