import React from "react";
import { Navigate } from "react-router-dom";
import { useApp } from "@/lib/AppContext";

// Guards a route to a specific role. Wrong role -> redirected to their own home.
export default function RoleGuard({ role, children }) {
  const { user } = useApp();
  const current = user?.role;
  if (current !== role) {
    const home = current === "VENDOR" ? "/studio" : current === "ADMIN" ? "/admin" : "/";
    return <Navigate to={home} replace />;
  }
  return children;
}