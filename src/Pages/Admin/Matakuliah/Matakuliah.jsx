import React, { useState, useEffect } from "react";
import Card from "../../Auth/Components/Card";
import Heading from "../../Auth/Components/Heading";
import Button from "../../Auth/Components/Button";
import Input from "../../Auth/Components/Input";
import Label from "../../Auth/Components/Label";
import Modal from "../../Auth/Components/Modal";
import {
  getAllMatakuliah,
  storeMatakuliah,
  updateMatakuliah,
  deleteMatakuliah,
} from "../../../Utils/Apis/MatakuliahApi";
import { confirmDelete } from "../../../Utils/Helpers/SwalHelpers";
import { toastSuccess, toastError } from "../../../Utils/Helpers/ToastHelpers";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";

export default function Matakuliah() {
  const [mkList, setMkList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ id: "", kode: "", nama: "", sks: "" });
  const [isEdit, setIsEdit] = useState(false);

  const { user } = useAuthStateContext();
  const perms = user?.permission || [];

  useEffect(() => {
    fetchMK();
  }, []);

  const fetchMK = async () => {
    try {
      const res = await getAllMatakuliah();
      setMkList(res.data);
    } catch (err) {
      toastError("Gagal mengambil data mata kuliah!");
    }
  };

  const handleOpenCreate = () => {
    setForm({ id: "", kode: "", nama: "", sks: "" });
    setIsEdit(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (mk) => {
    setForm(mk);
    setIsEdit(true);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, sks: Number(form.sks) };
      if (isEdit) {
        await updateMatakuliah(form.id, payload);
        toastSuccess("Mata kuliah berhasil diperbarui!");
      } else {
        payload.id = String(Date.now());
        await storeMatakuliah(payload);
        toastSuccess("Mata kuliah berhasil didaftarkan!");
      }
      setIsModalOpen(false);
      fetchMK();
    } catch (err) {
      toastError("Gagal menyimpan data!");
    }
  };

  const handleDelete = (id) => {
    confirmDelete(async () => {
      try {
        await deleteMatakuliah(id);
        toastSuccess("Mata kuliah berhasil dihapus!");
        fetchMK();
      } catch (err) {
        toastError("Gagal menghapus data!");
      }
    });
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-6">
        <Heading as="h2" className="mb-0 text-blue-600">
          Daftar Mata Kuliah
        </Heading>
        {perms.includes("matakuliah.create") && (
          <Button onClick={handleOpenCreate}>+ Tambah Mata Kuliah</Button>
        )}
      </div>

      <div className="overflow-hidden border border-slate-100 rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-600 text-sm font-bold">
              <th className="p-4 pl-6">Kode Matkul</th>
              <th className="p-4">Nama Mata Kuliah</th>
              <th className="p-4 text-center">Beban SKS</th>
              {(perms.includes("matakuliah.update") ||
                perms.includes("matakuliah.delete")) && (
                <th className="p-4 pr-6 text-center">Aksi</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
            {mkList.map((mk) => (
              <tr
                key={mk.id}
                className="hover:bg-slate-50/80 transition-colors"
              >
                <td className="p-4 pl-6 font-mono text-indigo-600 font-bold">
                  {mk.kode}
                </td>
                <td className="p-4 font-bold text-slate-800">{mk.nama}</td>
                <td className="p-4 text-center font-medium">
                  <span className="bg-slate-100 px-2.5 py-1 rounded-md text-slate-600">
                    {mk.sks} SKS
                  </span>
                </td>
                {(perms.includes("matakuliah.update") ||
                  perms.includes("matakuliah.delete")) && (
                  <td className="p-4 pr-6 flex items-center justify-center gap-2">
                    {perms.includes("matakuliah.update") && (
                      <button
                        onClick={() => handleOpenEdit(mk)}
                        className="px-3 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                      >
                        Edit
                      </button>
                    )}
                    {perms.includes("matakuliah.delete") && (
                      <button
                        onClick={() => handleDelete(mk.id)}
                        className="px-3 py-1.5 text-xs font-bold text-rose-600 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors"
                      >
                        Hapus
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
            {mkList.length === 0 && (
              <tr>
                <td
                  colSpan={
                    perms.includes("matakuliah.update") ||
                    perms.includes("matakuliah.delete")
                      ? "4"
                      : "3"
                  }
                  className="p-8 text-center text-slate-400 italic"
                >
                  Belum ada data mata kuliah yang terdaftar bray.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEdit ? "Sunting Mata Kuliah" : "Registrasi Mata Kuliah Baru"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="kode">Kode Mata Kuliah</Label>
            <Input
              type="text"
              id="kode"
              value={form.kode}
              onChange={(e) => setForm({ ...form, kode: e.target.value })}
              required
              placeholder="Contoh: A11.46RPL"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="nama">Nama Mata Kuliah</Label>
            <Input
              type="text"
              id="nama"
              value={form.nama}
              onChange={(e) => setForm({ ...form, nama: e.target.value })}
              required
              placeholder="Contoh: Pemrograman Sisi Klien"
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="sks">Beban SKS</Label>
            <Input
              type="number"
              id="sks"
              min="1"
              max="6"
              value={form.sks}
              onChange={(e) => setForm({ ...form, sks: e.target.value })}
              required
              placeholder="Contoh: 3"
              className="mt-1"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-5">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700"
            >
              Batal
            </button>
            <Button type="submit" className="px-5 py-2 rounded-xl font-bold">
              {isEdit ? "Simpan" : "Daftarkan"}
            </Button>
          </div>
        </form>
      </Modal>
    </Card>
  );
}
