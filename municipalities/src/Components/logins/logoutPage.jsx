import { logout } from "../../Functions/auth";
import { Navigate } from "react-router-dom";
import { useEffect } from "react";

function LogoutPage({ setRoleChange }) {
  useEffect(() => {
    logout();
    setRoleChange(Date.now());
  }, [setRoleChange]);

  return <Navigate to="/login" replace />;
}

export default LogoutPage;
