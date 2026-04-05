import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: any) => {
  const { token } = useContext(AuthContext);

  // Only block if NO token
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  console.log("TOKEN IN PROTECTED:", token);

  return children;
};

export default ProtectedRoute;