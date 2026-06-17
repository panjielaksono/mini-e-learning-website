import React, { useState, useEffect } from "react";
import Input from "@/Pages/Auth/Components/Input";
import Label from "@/Pages/Auth/Components/Label";
import Button from "@/Pages/Auth/Components/Button"; // Komponen induk bray
import Heading from "@/Pages/Auth/Components/Heading";

const MahasiswaModal = ({ isOpen, onClose, onSubmit, selectedMahasiswa }) => {
  // State form dll tetap sama bray...
  const [form, setForm] = useState({ nim: "", nama: "" });

  useEffect(() => {
    if (selectedMahasiswa) {
      setForm(selectedMahasiswa);
    } else {
      setForm({ nim: "", nama: "" });
    }
  }, [selectedMahasiswa]);

  if (!isOpen) return null;

  // Handler dll tetap sama bray...
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nim || !form.nama) return alert("NIM dan Nama wajib diisi yah!");

    onSubmit(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-7 border border-slate-100">
        <Heading as="h3" className="text-xl mb-5 font-black text-slate-900">
          {selectedMahasiswa ? "Edit Mahasiswa" : "Tambah Mahasiswa Baru"}
        </Heading>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nim">NIM</Label>
            <Input
              name="nim"
              value={form.nim}
              onChange={handleChange}
              readOnly={!!selectedMahasiswa}
              placeholder="Contoh: A11.2023.15237"
              required
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="nama">Nama Lengkap</Label>
            <Input
              name="nama"
              value={form.nama}
              onChange={handleChange}
              placeholder="Masukkan Nama Lengkap"
              required
              className="mt-1.5"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-6 border-t border-slate-100 mt-5">
            <button
              type="button"
              className="px-5 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
              onClick={onClose}
            >
              Batal
            </button>
            <Button type="submit" className="text-sm font-bold rounded-xl px-6">
              Simpan Data
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MahasiswaModal;
