import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";
import { toastSuccess } from "@/Utils/Helpers/ToastHelpers";

const Sidebar = ({ isOpen }) => {
  const navigate = useNavigate();
  const { user, setUser } = useAuthStateContext();
  const userPermissions = user?.permission || [];

  const handleLogout = () => {
    setUser(null);
    toastSuccess("Logout berhasil! Sampai jumpa lagi bray.");
    navigate("/");
  };

  // Konfigurasi style kelas SVG bawaan bray
  const iconClass = "w-5 h-5 flex-shrink-0 transition-colors duration-150";

  return (
    <aside
      className={`bg-blue-800 text-white h-screen transition-all duration-300 flex flex-col shadow-xl select-none flex-shrink-0 z-50 ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      {/* ================= BRAND HEADER SIDEBAR ================= */}
      <div
        className={`flex items-center h-16 border-b border-blue-700/50 px-5 overflow-hidden ${
          isOpen ? "justify-start" : "justify-center"
        }`}
      >
        {isOpen ? (
          <span className="text-sm font-black tracking-widest uppercase text-white font-mono">
            E-Learning System
          </span>
        ) : (
          <span className="text-base font-black text-white font-mono tracking-tighter">
            EL
          </span>
        )}
      </div>

      {/* ================= DAFTAR MENU NAVIGASI ================= */}
      <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
        {/* DASHBOARD */}
        {userPermissions.includes("dashboard.page") && (
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `flex items-center py-3 rounded-r-xl transition-all duration-150 group border-l-4 ${
                isOpen ? "pl-4 pr-4 space-x-3" : "justify-center pl-0 pr-0"
              } ${
                isActive
                  ? "bg-white/10 text-white border-l-blue-400 font-bold shadow-sm"
                  : "border-l-transparent text-blue-200/70 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <svg
              className={iconClass}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span
              className={`text-xs tracking-wide transition-opacity duration-200 ${isOpen ? "opacity-100 inline" : "opacity-0 hidden"}`}
            >
              Dashboard
            </span>
          </NavLink>
        )}

        {/* MAHASISWA */}
        {userPermissions.includes("mahasiswa.page") && (
          <NavLink
            to="/admin/mahasiswa"
            className={({ isActive }) =>
              `flex items-center py-3 rounded-r-xl transition-all duration-150 group border-l-4 ${
                isOpen ? "pl-4 pr-4 space-x-3" : "justify-center pl-0 pr-0"
              } ${
                isActive
                  ? "bg-white/10 text-white border-l-blue-400 font-bold shadow-sm"
                  : "border-l-transparent text-blue-200/70 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <svg
              className={iconClass}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 14l9-5-9-5-9 5 9 5z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
              />
            </svg>
            <span
              className={`text-xs tracking-wide transition-opacity duration-200 ${isOpen ? "opacity-100 inline" : "opacity-0 hidden"}`}
            >
              Mahasiswa
            </span>
          </NavLink>
        )}

        {/* DOSEN */}
        {userPermissions.includes("dosen.page") && (
          <NavLink
            to="/admin/dosen"
            className={({ isActive }) =>
              `flex items-center py-3 rounded-r-xl transition-all duration-150 group border-l-4 ${
                isOpen ? "pl-4 pr-4 space-x-3" : "justify-center pl-0 pr-0"
              } ${
                isActive
                  ? "bg-white/10 text-white border-l-blue-400 font-bold shadow-sm"
                  : "border-l-transparent text-blue-200/70 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <svg
              className={iconClass}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span
              className={`text-xs tracking-wide transition-opacity duration-200 ${isOpen ? "opacity-100 inline" : "opacity-0 hidden"}`}
            >
              Dosen
            </span>
          </NavLink>
        )}

        {/* MATA KULIAH */}
        {userPermissions.includes("matakuliah.page") && (
          <NavLink
            to="/admin/matakuliah"
            className={({ isActive }) =>
              `flex items-center py-3 rounded-r-xl transition-all duration-150 group border-l-4 ${
                isOpen ? "pl-4 pr-4 space-x-3" : "justify-center pl-0 pr-0"
              } ${
                isActive
                  ? "bg-white/10 text-white border-l-blue-400 font-bold shadow-sm"
                  : "border-l-transparent text-blue-200/70 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <svg
              className={iconClass}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <span
              className={`text-xs tracking-wide transition-opacity duration-200 ${isOpen ? "opacity-100 inline" : "opacity-0 hidden"}`}
            >
              Mata Kuliah
            </span>
          </NavLink>
        )}

        {/* RENCANA STUDI */}
        {userPermissions.includes("rencana-studi.page") && (
          <NavLink
            to="/admin/rencana-studi"
            className={({ isActive }) =>
              `flex items-center py-3 rounded-r-xl transition-all duration-150 group border-l-4 ${
                isOpen ? "pl-4 pr-4 space-x-3" : "justify-center pl-0 pr-0"
              } ${
                isActive
                  ? "bg-white/10 text-white border-l-blue-400 font-bold shadow-sm"
                  : "border-l-transparent text-blue-200/70 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <svg
              className={iconClass}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
            <span
              className={`text-xs tracking-wide transition-opacity duration-200 ${isOpen ? "opacity-100 inline" : "opacity-0 hidden"}`}
            >
              Rencana Studi
            </span>
          </NavLink>
        )}

        {/* MANAJEMEN AKSES */}
        {userPermissions.includes("mahasiswa.delete") && (
          <NavLink
            to="/admin/user"
            className={({ isActive }) =>
              `flex items-center py-3 rounded-r-xl transition-all duration-150 group border-l-4 ${
                isOpen ? "pl-4 pr-4 space-x-3" : "justify-center pl-0 pr-0"
              } ${
                isActive
                  ? "bg-white/10 text-white border-l-blue-400 font-bold shadow-sm"
                  : "border-l-transparent text-blue-200/70 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <svg
              className={iconClass}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span
              className={`text-xs tracking-wide transition-opacity duration-200 ${isOpen ? "opacity-100 inline" : "opacity-0 hidden"}`}
            >
              Manajemen Akses
            </span>
          </NavLink>
        )}
      </nav>

      {/* ================= BUTTON LOGOUT ================= */}
      <div className="p-3 border-t border-blue-700/50 bg-blue-900/10">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center py-3 rounded-xl font-bold bg-rose-500/10 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/10 hover:border-rose-600 transition-all duration-150 cursor-pointer active:scale-95 ${
            isOpen ? "px-4 space-x-3 justify-start" : "justify-center px-0"
          }`}
        >
          <svg
            className={iconClass}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span
            className={`text-xs tracking-wide transition-opacity duration-200 ${isOpen ? "opacity-100 inline" : "opacity-0 hidden"}`}
          >
            Keluar Sistem
          </span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
