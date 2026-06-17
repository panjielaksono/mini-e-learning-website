import React, { useState, useEffect } from "react";
import Card from "@/Pages/Auth/Components/Card";
import Heading from "@/Pages/Auth/Components/Heading";
import Button from "@/Pages/Auth/Components/Button";
import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";
import { confirmDelete } from "@/Utils/Helpers/SwalHelpers";

import {
  getAllKelas,
  updateKelas,
  deleteKelas,
  storeKelas,
} from "@/Utils/Apis/KelasApi";
import { getAllDosen } from "@/Utils/Apis/DosenApi";
import { getAllMahasiswa } from "@/Utils/Apis/MahasiswaApi";
import { getAllMataKuliah } from "@/Utils/Apis/MataKuliahApi";

import TableRencanaStudi from "./TableRencanaStudi";
import ModalRencanaStudi from "./ModalRencanaStudi";

export default function RencanaStudi() {
  const { user } = useAuthStateContext();
  const [kelas, setKelas] = useState([]);
  const [dosen, setDosen] = useState([]);
  const [mahasiswa, setMahasiswa] = useState([]);
  const [mataKuliah, setMataKuliah] = useState([]);

  const [selectedMhs, setSelectedMhs] = useState({});
  const [selectedDsn, setSelectedDsn] = useState({});

  const [form, setForm] = useState({ mata_kuliah_id: "", dosen_id: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resKelas, resDosen, resMahasiswa, resMataKuliah] =
        await Promise.all([
          getAllKelas(),
          getAllDosen(),
          getAllMahasiswa(),
          getAllMataKuliah(),
        ]);
      setKelas(resKelas.data?.data ?? resKelas.data ?? []);
      setDosen(resDosen.data?.data ?? resDosen.data ?? []);
      setMahasiswa(resMahasiswa.data?.data ?? resMahasiswa.data ?? []);

      setMataKuliah(resMataKuliah.data?.data ?? resMataKuliah.data ?? []);
    } catch (err) {
      toastError("Gagal mengambil data server rencana studi bray!");
    }
  };

  const mataKuliahSudahDipakai = kelas.map((k) => k.mata_kuliah_id);
  const mataKuliahBelumAdaKelas = mataKuliah.filter(
    (m) => !mataKuliahSudahDipakai.includes(m.id),
  );

  const getMaxSks = (id) => mahasiswa.find((m) => m.id === id)?.max_sks || 0;
  const getDosenMaxSks = (id) => dosen.find((d) => d.id === id)?.max_sks || 0;

  const handleAddMahasiswa = async (kelasItem, mhsId) => {
    if (!mhsId) return toastError("Pilih mahasiswa terlebih dahulu bray!");

    const matkul = mataKuliah.find((m) => m.id === kelasItem.mata_kuliah_id);
    const sks = matkul?.sks || 0;

    const totalSksMahasiswa = kelas
      .filter((k) => k.mahasiswa_ids?.includes(mhsId))
      .map((k) => mataKuliah.find((m) => m.id === k.mata_kuliah_id)?.sks || 0)
      .reduce((acc, curr) => acc + curr, 0);

    const maxSks = getMaxSks(mhsId);

    if (totalSksMahasiswa + sks > maxSks) {
      toastError(
        `Gagal! SKS melebihi batas maksimal mahasiswa (${maxSks} SKS)`,
      );
      return;
    }

    if (kelasItem.mahasiswa_ids?.includes(mhsId)) {
      toastError("Mahasiswa ini sudah terdaftar di kelas bray!");
      return;
    }

    const updated = {
      ...kelasItem,
      mahasiswa_ids: [...(kelasItem.mahasiswa_ids || []), mhsId],
    };

    await updateKelas(kelasItem.id, updated);
    toastSuccess("Mahasiswa berhasil diplot ke kelas bray!");
    setSelectedMhs((prev) => ({ ...prev, [kelasItem.id]: "" }));
    fetchData();
  };

  const handleDeleteMahasiswa = async (kelasItem, mhsId) => {
    const updated = {
      ...kelasItem,
      mahasiswa_ids: (kelasItem.mahasiswa_ids || []).filter(
        (id) => id !== mhsId,
      ),
    };

    await updateKelas(kelasItem.id, updated);
    toastSuccess("Mahasiswa berhasil dikeluarkan dari kelas.");
    fetchData();
  };

  const handleChangeDosen = async (kelasItem) => {
    const dsnId = selectedDsn[kelasItem.id];
    if (!dsnId) return toastError("Pilih dosen pengampu baru!");

    const totalSksDosen = kelas
      .filter((k) => k.dosen_id === dsnId)
      .map((k) => mataKuliah.find((m) => m.id === k.mata_kuliah_id)?.sks || 0)
      .reduce((acc, curr) => acc + curr, 0);

    const kelasSks =
      mataKuliah.find((m) => m.id === kelasItem.mata_kuliah_id)?.sks || 0;
    const maxSks = getDosenMaxSks(dsnId);

    if (totalSksDosen + kelasSks > maxSks) {
      toastError(
        `Gagal! Dosen mengampu melebihi batas maksimal SKS (${maxSks} SKS)`,
      );
      return;
    }

    await updateKelas(kelasItem.id, { ...kelasItem, dosen_id: dsnId });
    toastSuccess("Dosen pengampu berhasil diperbarui!");
    fetchData();
  };

  const handleDeleteKelas = async (kelasId) => {
    confirmDelete(async () => {
      await deleteKelas(kelasId);
      toastSuccess("Kelas kuliah berhasil dihapus bray!");
      fetchData();
    });
  };

  const openAddModal = () => {
    setForm({ mata_kuliah_id: "", dosen_id: "" });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.mata_kuliah_id || !form.dosen_id) {
      toastError("Form input tidak lengkap bray!");
      return;
    }
    const payload = {
      ...form,
      nama: `A11.46${String(kelas.length + 1).padStart(2, "0")}`,
      mahasiswa_ids: [],
    };
    await storeKelas(payload);
    setIsModalOpen(false);
    toastSuccess("Kelas rencana studi baru berhasil ditambahkan!");
    fetchData();
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-6">
        <Heading as="h2" className="mb-0 text-blue-600">
          Daftar Rencana Studi
        </Heading>
        {user?.permission?.includes("rencana-studi.create") && (
          <Button onClick={openAddModal}>+ Tambah Kelas Kuliah</Button>
        )}
      </div>

      <TableRencanaStudi
        kelas={kelas}
        mahasiswa={mahasiswa}
        dosen={dosen}
        mataKuliah={mataKuliah}
        selectedMhs={selectedMhs}
        setSelectedMhs={setSelectedMhs}
        selectedDsn={selectedDsn}
        setSelectedDsn={setSelectedDsn}
        handleAddMahasiswa={handleAddMahasiswa}
        handleDeleteMahasiswa={handleDeleteMahasiswa}
        handleChangeDosen={handleChangeDosen}
        handleDeleteKelas={handleDeleteKelas}
        permissions={user?.permission || []}
      />

      <ModalRencanaStudi
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onChange={handleChange}
        onSubmit={handleSubmit}
        form={form}
        dosen={dosen}
        mataKuliah={mataKuliahBelumAdaKelas}
      />
    </Card>
  );
}
