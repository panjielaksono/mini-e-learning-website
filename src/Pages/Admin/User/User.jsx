import React, { useState, useEffect } from "react";
import { getAllUsers, updateUser } from "@/Utils/Apis/UserApi";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";
import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";
import Modal from "@/Pages/Auth/Components/Modal";

export default function User() {
  const { user: currentUser } = useAuthStateContext();
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [role, setRole] = useState("Guest");
  const [permissions, setPermissions] = useState([]);

  const masterPermissions = [
    "dashboard.page",
    "mahasiswa.page",
    "mahasiswa.create",
    "mahasiswa.update",
    "mahasiswa.delete",
    "dosen.page",
    "dosen.create",
    "dosen.update",
    "dosen.delete",
    "matakuliah.page",
    "matakuliah.create",
    "matakuliah.update",
    "matakuliah.delete",
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data);
    } catch (err) {
      toastError("Gagal mengambil data user server!");
    }
  };

  const handleOpenEdit = (user) => {
    setSelectedUser(user);
    setRole(user.role || "Guest");
    setPermissions(user.permission || []);
    setIsModalOpen(true);
  };

  const handlePermissionChange = (perm) => {
    if (permissions.includes(perm)) {
      setPermissions(permissions.filter((p) => p !== perm));
    } else {
      setPermissions([...permissions, perm]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...selectedUser,
        role: role,
        permission: permissions,
      };

      await updateUser(selectedUser.id, payload);
      toastSuccess(`Berhasil memperbarui hak akses ${selectedUser.name}!`);
      setIsModalOpen(false);
      fetchUsers();
    } catch (err) {
      toastError("Gagal memperbarui data user!");
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-2xl font-black text-slate-800">
          Manajemen Hak Akses User
        </h2>
        <p className="text-slate-500 text-sm">
          Kelola otorisasi, role, dan fine-grained permission akun.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-600 text-sm font-bold">
              <th className="p-4 pl-6">Nama</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4">Permissions Active</th>
              <th className="p-4 pr-6 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="p-4 pl-6 font-bold text-slate-800">{u.name}</td>
                <td className="p-4">{u.email}</td>
                <td className="p-4">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-black ${u.role === "Admin" ? "bg-rose-50 text-rose-600 border border-rose-100" : "bg-slate-100 text-slate-600"}`}
                  >
                    {u.role || "Guest"}
                  </span>
                </td>
                <td className="p-4 max-w-xs truncate">
                  <div className="flex flex-wrap gap-1">
                    {u.permission?.map((p, idx) => (
                      <span
                        key={idx}
                        className="bg-indigo-50 text-indigo-600 text-[10px] px-1.5 py-0.5 rounded font-mono"
                      >
                        {p}
                      </span>
                    )) || (
                      <span className="text-slate-400 italic">
                        No permission
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-4 pr-6 text-center">
                  <button
                    onClick={() => handleOpenEdit(u)}
                    disabled={u.id === currentUser?.id} // Cegah admin ngunci/ngedit akunnya sendiri biar ga amsyiong bray
                    className="px-3 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Set Akses
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL EDIT ROLE & PERMISSION */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Pengaturan Akses: ${selectedUser?.name}`}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* PILIHAN ROLE (Sesuai Ledger: Hanya Admin & Guest) */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Pilih Tipe Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="Admin">Admin</option>
              <option value="Guest">Guest</option>
            </select>
          </div>

          {/* PILIHAN FINE-GRAINED PERMISSION - DI KASIH SCROLL BIAR GAK OVERFLOW BRAY */}
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">
              Hak Akses Menu & Fitur (Permissions)
            </label>

            {/* UPDATE BARIS DI BAWAH INI BRAY: Tambahin max-h-60 dan overflow-y-auto */}
            <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-100 max-h-60 overflow-y-auto custom-scrollbar">
              {masterPermissions.map((perm) => (
                <label
                  key={perm}
                  className="flex items-center gap-3 cursor-pointer p-1.5 hover:bg-white rounded-lg transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={permissions.includes(perm)}
                    onChange={() => handlePermissionChange(perm)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                  />
                  <span className="text-sm font-mono text-slate-700">
                    {perm}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 text-white rounded-xl font-bold shadow-md hover:bg-indigo-700"
            >
              Simpan Hak Akses
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
