import React, { useState } from "react";
import Card from "@/Pages/Auth/Components/Card";
import Heading from "@/Pages/Auth/Components/Heading";
import Button from "@/Pages/Auth/Components/Button";
import { confirmDelete, confirmUpdate } from "@/Utils/Helpers/SwalHelpers";
import { toastError } from "@/Utils/Helpers/ToastHelpers";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";
import {
  useMahasiswa,
  useStoreMahasiswa,
  useUpdateMahasiswa,
  useDeleteMahasiswa,
} from "@/Utils/Hooks/useMahasiswa";
import { useKelas } from "@/Utils/Hooks/useKelas";
import { useMataKuliah } from "@/Utils/Hooks/useMataKuliah";
import MahasiswaTable from "./MahasiswaTable";
import MahasiswaModal from "./MahasiswaModal";

const Mahasiswa = () => {
  const [selectedMahasiswa, setSelectedMahasiswa] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [sortBy, setSortBy] = useState("nama");
  const [sortOrder, setSortOrder] = useState("asc");
  const [search, setSearch] = useState("");

  const { user } = useAuthStateContext();
  const perms = user?.permission || [];

  const mappedSortBy = sortBy === "nama" ? "name" : sortBy;
  const { data: result = [], isLoading: loadingMhs } = useMahasiswa({
    order: `${mappedSortBy}.${sortOrder}`,
  });

  const { data: kelas = [], isLoading: loadingKelas } = useKelas();
  const { data: mataKuliah = [], isLoading: loadingMatkul } = useMataKuliah();

  const rawMahasiswa = Array.isArray(result) ? result : (result?.data ?? []);

  const filteredMahasiswa = rawMahasiswa.filter((m) => {
    const studentName = m.name || m.nama || "";
    const studentNim = m.nim || "";
    return (
      studentName.toLowerCase().includes(search.toLowerCase()) ||
      studentNim.toLowerCase().includes(search.toLowerCase())
    );
  });

  const totalCount = filteredMahasiswa.length;
  const totalPages = Math.ceil(totalCount / limit) || 1;
  const offset = (page - 1) * limit;
  const mahasiswa = filteredMahasiswa.slice(offset, offset + limit);

  const { mutate: store } = useStoreMahasiswa();
  const { mutate: update } = useUpdateMahasiswa();
  const { mutate: remove } = useDeleteMahasiswa();

  const openAddModal = () => {
    setSelectedMahasiswa(null);
    setIsModalOpen(true);
  };

  const openEditModal = (mhs) => {
    setSelectedMahasiswa(mhs);
    setIsModalOpen(true);
  };

  const handleSubmit = (formData) => {
    const payload = {
      name: formData.nama || formData.name,
      nim: formData.nim,
      max_sks: formData.max_sks ? Number(formData.max_sks) : 24,
    };

    if (selectedMahasiswa) {
      confirmUpdate(() => {
        update({ id: selectedMahasiswa.id, data: payload });
        setIsModalOpen(false);
      });
    } else {
      const targetArray = Array.isArray(rawMahasiswa) ? rawMahasiswa : [];
      const isExist = targetArray.find((m) => m.nim === formData.nim);
      if (isExist) return toastError("NIM sudah terdaftar!");

      store({ ...payload, id: String(Date.now()) });
      setIsModalOpen(false);
    }
  };

  const handleDeleteMahasiswa = (id) => {
    confirmDelete(() => {
      remove(id);
    });
  };

  const handlePrev = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () => setPage((prev) => Math.min(prev + 1, totalPages));

  const isGlobalLoading = loadingMhs || loadingKelas || loadingMatkul;

  const getTotalSks = (mhsId) => {
    return kelas
      .filter((k) => k.mahasiswa_ids?.includes(mhsId))
      .map((k) => mataKuliah.find((mk) => mk.id === k.mata_kuliah_id)?.sks || 0)
      .reduce((a, b) => a + b, 0);
  };

  return (
    <Card>
      <div className="flex justify-between items-center mb-6">
        <Heading as="h2" className="mb-0 text-blue-600">
          Daftar Mahasiswa
        </Heading>
        {perms.includes("mahasiswa.create") && (
          <Button onClick={openAddModal}>+ Tambah Mahasiswa</Button>
        )}
      </div>

      <div className="flex flex-wrap gap-3 mb-5 bg-slate-50 p-4 rounded-xl border border-slate-100">
        <input
          type="text"
          placeholder="Cari nama atau NIM..."
          className="border border-slate-200 bg-white px-4 py-2 rounded-xl text-sm flex-grow focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-700"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            setPage(1);
          }}
          className="border border-slate-200 bg-white px-3 py-2 rounded-xl text-sm focus:outline-none text-slate-600 font-medium"
        >
          <option value="nama">Sort by Nama</option>
          <option value="nim">Sort by NIM</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => {
            setSortOrder(e.target.value);
            setPage(1);
          }}
          className="border border-slate-200 bg-white px-3 py-2 rounded-xl text-sm focus:outline-none text-slate-600 font-medium"
        >
          <option value="asc">Ascending (A-Z)</option>
          <option value="desc">Descending (Z-A)</option>
        </select>

        <select
          value={limit}
          onChange={(e) => {
            setLimit(Number(e.target.value));
            setPage(1);
          }}
          className="border border-slate-200 bg-white px-3 py-2 rounded-xl text-sm focus:outline-none text-slate-600 font-medium"
        >
          <option value={5}>5 / halaman</option>
          <option value={10}>10 / halaman</option>
          <option value={25}>25 / halaman</option>
        </select>
      </div>

      {isGlobalLoading ? (
        <div className="p-10 text-center text-slate-500 italic font-medium">
          Memuat data ter-pagination via TanStack Query...
        </div>
      ) : (
        <>
          <MahasiswaTable
            data={mahasiswa}
            openEditModal={openEditModal}
            onDelete={handleDeleteMahasiswa}
            permissions={perms}
          />

          <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-100 text-slate-600 text-sm font-medium">
            <p>
              Halaman <span className="text-blue-600 font-bold">{page}</span>{" "}
              dari <span className="font-bold">{totalPages}</span> ({totalCount}{" "}
              total data)
            </p>
            <div className="flex gap-2">
              <button
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl disabled:opacity-40 disabled:hover:bg-slate-100 transition-colors cursor-pointer"
                onClick={handlePrev}
                disabled={page === 1}
              >
                Prev
              </button>
              <button
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl disabled:opacity-40 disabled:hover:bg-slate-100 transition-colors cursor-pointer"
                onClick={handleNext}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      <MahasiswaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        selectedMahasiswa={selectedMahasiswa}
        dataKelas={kelas}
        dataMataKuliah={mataKuliah}
        getTotalSks={getTotalSks}
      />
    </Card>
  );
};

export default Mahasiswa;
