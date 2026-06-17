import React from "react";
import Label from "@/Pages/Auth/Components/Label";
import Button from "@/Pages/Auth/Components/Button";

export default function ModalRencanaStudi({
  isOpen,
  onClose,
  onSubmit,
  onChange,
  form,
  dosen,
  mataKuliah,
}) {
  if (!isOpen) return null;

  const isMatkulEmpty = !mataKuliah || mataKuliah.length === 0;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 border border-slate-100">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-5">
          <h2 className="text-base font-black text-slate-900 tracking-tight">
            Buka Kelas Kuliah Baru
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-2xl font-bold transition-colors cursor-pointer"
          >
            &times;
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Dropdown Pilihan Mata Kuliah */}
          <div>
            <Label
              htmlFor="mata_kuliah_id"
              className="text-xs font-bold text-slate-700"
            >
              Mata Kuliah Pilihan
            </Label>
            <select
              name="mata_kuliah_id"
              value={form.mata_kuliah_id}
              onChange={onChange}
              className={`w-full border ${isMatkulEmpty ? "border-amber-200 bg-amber-50/40 text-amber-800" : "border-slate-200 bg-white text-slate-700"} px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1 font-medium transition-all`}
              required
              disabled={isMatkulEmpty}
            >
              {isMatkulEmpty ? (
                <option value="">
                  ⚠️ Semua mata kuliah sudah memiliki kelas
                </option>
              ) : (
                <>
                  <option value="">-- Pilih Mata Kuliah --</option>
                  {mataKuliah.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nama || m.name} ({m.sks} SKS)
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>

          {/* Dropdown Pilihan Dosen */}
          <div>
            <Label
              htmlFor="dosen_id"
              className="text-xs font-bold text-slate-700"
            >
              Dosen Pengampu Utama
            </Label>
            <select
              name="dosen_id"
              value={form.dosen_id}
              onChange={onChange}
              className="w-full border border-slate-200 px-3 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white mt-1 text-slate-700 font-medium shadow-sm transition-all"
              required
            >
              <option value="">-- Pilih Dosen Pengampu --</option>
              {dosen.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nama || d.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-bold text-slate-500 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <Button
              type="submit"
              className="text-sm rounded-xl px-5 py-2 shadow-sm hover:shadow-md transition-all"
              disabled={isMatkulEmpty}
            >
              Simpan Kelas
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
