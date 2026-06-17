import React from "react";
import ReactDOM from "react-dom/client";
import {
  Navigate,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/Utils/Contexts/AuthContext";

// Layouts
import AuthLayout from "@/Pages/Auth/AuthLayout";
import AdminLayout from "@/Pages/Admin/AdminLayout";
import ProtectedRoute from "@/Pages/Admin/Components/ProtectedRoute";

// Halaman Auth
import Login from "@/Pages/Auth/Login/Login";
import Register from "@/Pages/Auth/Register/Register";

// Halaman Admin
import Dashboard from "@/Pages/Admin/Dashboard/Dashboard";
import Mahasiswa from "@/Pages/Admin/Mahasiswa/Mahasiswa";
import MahasiswaDetail from "@/Pages/Admin/MahasiswaDetail/MahasiswaDetail";
import Dosen from "@/Pages/Admin/Dosen/Dosen";
import Matakuliah from "@/Pages/Admin/Matakuliah/Matakuliah";
import UserManagement from "@/Pages/Admin/User/User";
import RencanaStudi from "@/Pages/Admin/RencanaStudi/RencanaStudi";
// Halaman Error
import PageNotFound from "@/Pages/Error/PageNotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { index: true, element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="dashboard" replace /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "mahasiswa", element: <Mahasiswa /> },
      { path: "mahasiswa/:nim", element: <MahasiswaDetail /> },
      { path: "dosen", element: <Dosen /> },
      { path: "matakuliah", element: <Matakuliah /> },
      { path: "rencana-studi", element: <RencanaStudi /> },
      { path: "user", element: <UserManagement /> },
    ],
  },
  { path: "*", element: <PageNotFound /> },
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" />
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
