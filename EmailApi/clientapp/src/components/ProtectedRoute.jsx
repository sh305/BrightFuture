import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const AUTH_KEY = "bfAuth";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const location = useLocation();

  try {
    const raw = localStorage.getItem(AUTH_KEY);
    const auth = raw ? JSON.parse(raw) : null;

    if (!auth || !auth.role) {
      return <Navigate to="/admin-login" replace state={{ from: location.pathname }} />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(auth.role)) {
      return <Navigate to="/admin-login" replace state={{ from: location.pathname }} />;
    }

    return children;
  } catch {
    return <Navigate to="/admin-login" replace state={{ from: location.pathname }} />;
  }
}
