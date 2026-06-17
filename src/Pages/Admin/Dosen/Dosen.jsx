import React, { useState, useEffect } from "react";
import Card from "../../Auth/Components/Card"; // Impor Card bray
import Heading from "../../Auth/Components/Heading";
import Button from "../../Auth/Components/Button";
import Input from "../../Auth/Components/Input";
import Label from "../../Auth/Components/Label";
import Modal from "../../Auth/Components/Modal";
import {
  getAllDosen,
  storeDosen,
  updateDosen,
  deleteDosen,
} from "../../../Utils/Apis/DosenApi";
import { confirmDelete } from "../../../Utils/Helpers/SwalHelpers";
import { toastSuccess, toastError } from "../../../Utils/Helpers/ToastHelpers";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";

export default function Dosen() {
  const [dosenList, setDosenList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ id: "", nidn: "", nama: "", email: "" });
  const [isEdit, setIsEdit] = useState(false);

  const { user } = useAuthStateContext();
  const perms = user?.permission || [];

  useEffect(() => {
    fetchDosen();
  }, []);

  const fetchDosen = async () => {
    try {
      const res = await getAllDosen();
      setDosenList(res.data);
    } catch (err) {
      toastError("Gagal mengambil data dosen!");
    }
  };

  const handleOpenCreate = () => {
    setForm({ id: "", nidn: "", nama: "", email: "" });
    setIsEdit(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (dosen) => {
    setForm(dosen);
    setIsEdit(true);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await updateDosen(form.id, form);
        toastSuccess("Data dosen berhasil diubah bray!");
      } else {
        const payload = { ...form, id: String(Date.now()) };
        await storeDosen(payload);
        toastSuccess("Dosen baru berhasil ditambahkan!");
      }
      setIsModalOpen(false);
      fetchDosen();
    } catch (err) {
      toastError("Gagal memproses data!");
    }
  };

  const handleDelete = (id) => {
    confirmDelete(async () => {
      try {
        await deleteDosen(id);
        toastSuccess("Data dosen dihapus!");
        fetchDosen();
      } catch (err) {
        toastError("Gagal menghapus data!");
      }
    });
  };

  return (
    <Card>
      {/* HEADER PATTERN SERAGAM */}
      <div className="flex justify-between items-center mb-6">
        <Heading as="h2" className="mb-0 text-blue-600">
          Daftar Dosen
        </Heading>
        {perms.includes("dosen.create") && (
          <Button onClick={handleOpenCreate}>+ Tambah Dosen</Button>
        )}
      </div>

      <div className="overflow-hidden border border-slate-100 rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead>
 <tr className="bg-slate-50 border-b border-slate-100 text-slate-600 text-sm font-bold">
              <th className="p-4 pl-6">NIDN</th>
              <th className="p-4">Nama Dosen</th>
              <th className="p-4">Email</th>
              {(perms.includes("dosen.update") || perms.includes("dosen.delete")) && (
                <th className="p-4 pr-6 text-center">Aksi</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
            {dosenList.map((dsn) => (
              <tr key={dsn.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="p-4 pl-6 font-medium">{dsn.nidn}</td>
                <td className="p-4 font-bold text-slate-800">{dsn.nama}</td>
                <td className="p-4">{dsn.email}</td>
                {(perms.includes("dosen.update") || perms.includes("dosen.delete")) && (
                  <td className="p-4 pr-6 flex items-center justify-center gap-2">
                    {perms.includes("dosen.update") && (
                      <button
                        onClick={() => handleOpenEdit(dsn)}
                        className="px-3 py-1.5 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
                      >
                        Edit
                      </button>
                    )}
                    {perms.includes("dosen.delete") && (
                      <button
                        onClick={() => handleDelete(dsn.id)}
                        className="px-3 py-1.5 text-xs font-bold text-rose-600 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors"
                      >
                        Hapus
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
            {dosenList.length === 0 && (
              <tr>
                <td
                  colSpan={perms.includes("dosen.update") || perms.includes("dosen.delete") ? "4" : "3"}
                  className="p-8 text-center text-slate-400 italic"
                >
                  Belum ada data dosen pengampu bray.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={isEdit ? "Sunting Data Dosen" : "Tambah Dosen Baru"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="nidn">NIDN</Label>
            <Input
              type="text"
              id="nidn"
              value={form.nidn}
              onChange={(e) => setForm({ ...form, nidn: e.target.value })}
              required
              placeholder="Masukkan 10 digit NIDN"
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="nama">Nama Lengkap</Label>
            <Input
              type="text"
              id="nama"
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
              required
              placeholder="Contoh: M Syaifur Rohman, M.CS"
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="email">Email Resmi</Label>
            <Input
              type="type"
              id="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              placeholder="dosen@dsn.dinus.ac.id"
              className="mt-1.5"
            />
          </div>
          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 mt-5">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-5 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Batal
            </button>
            <Button type="submit" className="text-sm font-bold rounded-xl px-6">
              {isEdit ? "Simpan Perubahan" : "Tambah Data"}
            </Button>
          </div>
        </form>
      </Modal>
    </Card>
  );
}