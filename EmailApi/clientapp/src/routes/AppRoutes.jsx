import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Page Components
import Home from "../pages/Home";
import Courses from "../pages/Courses";
import CourseDetails from "../pages/CourseDetails";
import About from "../pages/About";
import Gallery from "../pages/Gallery";
import Admission from "../pages/Admission";
import PaymentReceipt from "../pages/PaymentReceipt";
import AdminLogin from "../pages/AdminLogin";
import AdminDashboard from "../pages/AdminDashboard";
import Contact from "../pages/Contact";
import ProtectedRoute from "../components/ProtectedRoute";

/**
 * Centralized Route Configuration
 * Easily add, modify, or protect routes here in the future.
 */
export const routeConfig = [
  { path: "/", element: <Home /> },
  { path: "/courses", element: <Courses /> },
  { path: "/courses/:id", element: <CourseDetails /> },
  { path: "/about", element: <About /> },
  { path: "/gallery", element: <Gallery /> },
  { path: "/admission", element: <Admission /> },
  { path: "/payment-receipt", element: <PaymentReceipt /> },
  { path: "/admin-login", element: <AdminLogin /> },
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  { path: "/contact", element: <Contact /> },
  { path: "*", element: <Navigate to="/" replace /> },
];

export default function AppRoutes() {
  return (
    <Routes>
      {routeConfig.map((route, index) => (
        <Route key={route.path || index} path={route.path} element={route.element} />
      ))}
    </Routes>
  );
}
