import React, { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom"; // Pakai useNavigate blay
import Sidebar from "../Auth/Components/Sidebar";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";
import { toastError } from "@/Utils/Helpers/ToastHelpers"; // Impor toast andalan lu

export default function AdminLayout() {
  const { user, setUser } = useAuthStateContext(); // Ambil setUser juga blay
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const userPermissions = user?.permission || [];

  // 🔐 SATPAM ROUTE MAP: Hak akses wajib tiap halaman blay
  const routeGuardMap = {
    "/admin/dashboard": "dashboard.page",
    "/admin/mahasiswa": "mahasiswa.page",
    "/admin/dosen": "dosen.page",
    "/admin/matakuliah": "matakuliah.page",
    "/admin/rencana-studi": "rencana-studi.page",
    "/admin/user": "mahasiswa.delete",
  };

  const currentPath = location.pathname;
  const requiredPermission = routeGuardMap[currentPath];
  const hasPermission = requiredPermission
    ? userPermissions.includes(requiredPermission)
    : true;

  // 🔥 ENGINE UTAMA PEMUTUS LOOP NYELIP BRAY
  useEffect(() => {
    if (requiredPermission && !hasPermission) {
      toastError(
        "Akses ditolak! Akun Anda belum dikonfigurasi hak aksesnya blay.",
      );

      // Langkah Krusial: Paksa logout sesi biar Login.jsx gak ngilempar balik ke dashboard!
      setUser(null);

      // Tendang balik ke login secara aman
      navigate("/", { replace: true });
    }
  }, [currentPath, requiredPermission, hasPermission, setUser, navigate]);

  // Tahan render antarmuka selama proses penendangan berlangsung blay
  if (requiredPermission && !hasPermission) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 font-sans antialiased">
      {/* Oper state ke sidebar blay */}
      <Sidebar isOpen={isSidebarOpen} />

      {/* CONTAINER AREA KANAN */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* ================= HEADER AREA (CLEAN APP BAR) ================= */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 shadow-sm z-40 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/80 transition-all duration-150 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <h1 className="text-base font-black text-slate-800 tracking-tight font-mono uppercase">
              Web E-Learning
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md font-black font-mono tracking-wider uppercase border border-blue-100/50">
              {user?.role || "Guest"}
            </span>
            <p className="text-xs font-bold text-slate-600 hidden sm:block tracking-wide">
              {user?.name}
            </p>
          </div>
        </header>

        {/* ================= AREA KONTEN MANDIRI ================= */}
        <main className="p-6 flex-1 overflow-y-auto bg-slate-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
