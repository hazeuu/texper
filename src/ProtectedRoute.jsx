import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "./pages/internal/jsx/AuthContext";

function ProtectedRoute() {
  const { isLoggedIn, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Đang kiểm tra đăng nhập…</div>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
