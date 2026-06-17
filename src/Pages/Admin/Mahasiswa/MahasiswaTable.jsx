import React from "react";
import { Link } from "react-router-dom";
import Button from "@/Pages/Auth/Components/Button";

const MahasiswaTable = ({
  data = [],
  openEditModal,
  onDelete,
  permissions = [],
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left border-collapse">
        <thead className="bg-slate-50 uppercase text-xs text-slate-600 border-b border-slate-100">
          <tr>
            <th className="p-4 pl-6">NIM</th>
            <th className="p-4">Nama</th>
            {(permissions.includes("mahasiswa.update") ||
              permissions.includes("mahasiswa.delete")) && (
              <th className="p-4 pr-6 text-center">Aksi</th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 text-slate-700">
          {data && Array.isArray(data) && data.length > 0 ? (
            data.map((mhs) => (
              <tr
                key={mhs.id}
                className="border-b border-slate-100 hover:bg-slate-50/50"
              >
                <td className="p-4 pl-6 font-medium text-slate-800">
                  {mhs.nim}
                </td>
                <td className="p-4 font-bold text-slate-800">
                  {mhs.nama || mhs.name || "Nama Kosong"}
                </td>

                {(permissions.includes("mahasiswa.update") ||
                  permissions.includes("mahasiswa.delete")) && (
                  <td className="p-4 pr-6 text-center space-x-2 flex items-center justify-center">
                    <Link
                      to={`/admin/mahasiswa/${mhs.id}`}
                      className="px-3 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                    >
                      Detail
                    </Link>

                    {permissions.includes("mahasiswa.update") && (
                      <button
                        onClick={() => openEditModal(mhs)}
                        className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        Edit
                      </button>
                    )}

                    {permissions.includes("mahasiswa.delete") && (
                      <button
                        onClick={() => onDelete(mhs.id)}
                        className="px-3 py-1.5 text-xs font-bold text-rose-600 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors"
                      >
                        Hapus
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={
                  permissions.includes("mahasiswa.update") ||
                  permissions.includes("mahasiswa.delete")
                    ? "3"
                    : "2"
                }
                className="p-8 text-center text-slate-400 italic"
              >
                Belum ada data mahasiswa.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MahasiswaTable;
