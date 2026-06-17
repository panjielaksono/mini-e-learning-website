import React from "react";
import Button from "@/Pages/Auth/Components/Button";
import Select from "@/Pages/Auth/Components/Select";

export default function TableRencanaStudi({
  kelas,
  mahasiswa,
  dosen,
  mataKuliah,
  selectedMhs,
  setSelectedMhs,
  selectedDsn,
  setSelectedDsn,
  handleAddMahasiswa,
  handleDeleteMahasiswa,
  handleChangeDosen,
  handleDeleteKelas,
  permissions
}) {
  return (
    <div className="space-y-8">
      {kelas.map((kls) => {
        const matkul = mataKuliah.find((m) => m.id === kls.mata_kuliah_id);
        const dosenPengampu = dosen.find((d) => d.id === kls.dosen_id);
        const mhsInClass = (kls.mahasiswa_ids || []).map((id) => mahasiswa.find((m) => m.id === id)).filter(Boolean);

        return (
          <div key={kls.id} className="border border-slate-200/80 rounded-2xl shadow-sm bg-white overflow-hidden transition-all hover:shadow-md">
            
            {/* Header Informasi Kelas Utama */}
            <div className="flex flex-col md:flex-row justify-between md:items-center px-6 py-4 border-b bg-gradient-to-r from-slate-50 to-white gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-slate-200 text-slate-800 text-[11px] font-black tracking-wider px-2 py-0.5 rounded-md font-mono">
                    {kls.nama || `KELAS #${kls.id}`}
                  </span>
                  <h3 className="text-base font-black text-slate-800 tracking-tight">{matkul?.name || matkul?.nama || "-"}</h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Dosen Pengampu Aktif: <strong className="text-indigo-600 font-semibold">{dosenPengampu?.name || dosenPengampu?.nama || "-"}</strong> 
                  <span className="mx-2 text-slate-300">|</span> Beban: <strong className="text-slate-700 font-mono">{matkul?.sks || 0} SKS</strong>
                </p>
              </div>
              
              {/* Kontrol Aksi Dropdown Dosen */}
              <div className="flex items-center gap-2 self-end md:self-center">
                {permissions.includes("rencana-studi.update") && (
                  <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl border border-slate-200/40">
                    <Select
                      value={selectedDsn[kls.id] || ""}
                      onChange={(e) => setSelectedDsn({ ...selectedDsn, [kls.id]: e.target.value })}
                      size="sm"
                      className="w-48 border-0 bg-transparent focus:ring-0"
                    >
                      <option value="">-- Ganti Pengampu --</option>
                      {dosen.map((d) => (
                        <option key={d.id} value={d.id}>{d.name || d.nama}</option>
                      ))}
                    </Select>
                    <button 
                      onClick={() => handleChangeDosen(kls)} 
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs shadow-sm transition-all active:scale-95 cursor-pointer"
                    >
                      Simpan
                    </button>
                  </div>
                )}
                {permissions.includes("rencana-studi.delete") && mhsInClass.length === 0 && (
                  <button 
                    onClick={() => handleDeleteKelas(kls.id)} 
                    className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 font-black rounded-xl text-xs border border-rose-100 transition-colors cursor-pointer"
                  >
                    Hapus Kelas
                  </button>
                )}
              </div>
            </div>

            {/* Area Tabel Mahasiswa */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-slate-50/70 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-6 text-center w-16">No</th>
                    <th className="py-3 px-4">Nama Mahasiswa</th>
                    <th className="py-3 px-4">Nomor Induk Mahasiswa (NIM)</th>
                    <th className="py-3 px-4 text-center">Beban SKS</th>
                    {permissions.includes("rencana-studi.update") && <th className="py-3 px-6 text-center w-24">Aksi</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {mhsInClass.length > 0 ? (
                    mhsInClass.map((m, i) => {
                      const totalSks = kelas
                        .filter((k) => k.mahasiswa_ids?.includes(m.id))
                        .map((k) => mataKuliah.find((mk) => mk.id === k.mata_kuliah_id)?.sks || 0)
                        .reduce((a, b) => a + b, 0);

                      return (
                        <tr key={m.id} className="hover:bg-slate-50/30 transition-colors">
                          <td className="py-3.5 px-6 text-center font-mono text-slate-400 text-xs">{i + 1}</td>
                          <td className="py-3.5 px-4 font-bold text-slate-800">{m.name || m.nama}</td>
                          <td className="py-3.5 px-4 font-mono text-slate-600 text-xs">{m.nim}</td>
                          <td className="py-3.5 px-4 text-center">
                            <span className="bg-blue-50 border border-blue-100 text-blue-600 text-xs font-black font-mono px-2.5 py-0.5 rounded-full shadow-sm">
                              {totalSks} / {m.max_sks} SKS
                            </span>
                          </td>
                          {permissions.includes("rencana-studi.update") && (
                            <td className="py-3.5 px-6 text-center">
                              <button 
                                onClick={() => handleDeleteMahasiswa(kls, m.id)} 
                                className="text-xs font-black text-rose-500 hover:text-rose-700 hover:underline transition-colors cursor-pointer"
                              >
                                Keluarkan
                              </button>
                            </td>
                          )}
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={permissions.includes("rencana-studi.update") ? "5" : "4"} className="py-8 px-6 text-center italic text-slate-400 bg-white text-xs">
                        Belum ada mahasiswa yang terdaftar di dalam kelas KRS ini bray.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer Form Input Tambah Anggota KRS */}
            {permissions.includes("rencana-studi.update") && (
              <div className="flex items-center gap-3 px-6 py-3.5 border-t border-slate-100 bg-slate-50/20">
                <div className="w-64">
                  <Select
                    value={selectedMhs[kls.id] || ""}
                    onChange={(e) => setSelectedMhs({ ...selectedMhs, [kls.id]: e.target.value })}
                    size="sm"
                    className="border-slate-200 shadow-sm"
                  >
                    <option value="">-- Pilih Mahasiswa Berbakat --</option>
                    {mahasiswa.map((m) => (
                      <option key={m.id} value={m.id}>{m.name || m.nama} ({m.nim})</option>
                    ))}
                  </Select>
                </div>
                <button 
                  onClick={() => handleAddMahasiswa(kls, selectedMhs[kls.id])} 
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer"
                >
                  + Daftarkan ke Kelas
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}