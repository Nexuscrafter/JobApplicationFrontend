import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }: any) => {
  const { token, role } = useContext(AuthContext);

  // not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // not admin
  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;