import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "@/Pages/Auth/Components/Card";
import Heading from "@/Pages/Auth/Components/Heading";
import { getMahasiswa } from "@/Utils/Apis/MahasiswaApi";
import { toastError } from "@/Utils/Helpers/ToastHelpers";

const MahasiswaDetail = () => {
  const { nim } = useParams();
  const navigate = useNavigate();
  const [mahasiswa, setMahasiswa] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetail();
  }, [nim]);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      const res = await getMahasiswa(nim);
      setMahasiswa(res.data);
    } catch (err) {
      toastError("Gagal mengambil rincian data mahasiswa!");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <Card>
        <p className="text-center text-slate-500 italic">
          Memuat rincian data mahasiswa bray...
        </p>
      </Card>
    );

  if (!mahasiswa) {
    return (
      <Card>
        <p className="text-red-600 font-bold mb-4">
          Data mahasiswa tidak ditemukan bray.
        </p>
        <button
          onClick={() => navigate("/admin/mahasiswa")}
          className="px-5 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
        >
          Kembali ke Tabel
        </button>
      </Card>
    );
  }

  return (
    <Card>
      <Heading as="h2" className="text-blue-600 mb-0">
        Detail Mahasiswa
      </Heading>
      <div className="mt-4 space-y-3 bg-slate-50 p-6 rounded-2xl border border-slate-100 font-medium text-slate-700">
        <p>
          <strong>NIM:</strong>{" "}
          <span className="font-mono text-indigo-600 font-bold">
            {mahasiswa.nim}
          </span>
        </p>
        <p>
          <strong>Nama:</strong>{" "}
          <span className="text-slate-900 font-bold">{mahasiswa.nama}</span>
        </p>
      </div>
      <div className="mt-6">
        <button
          onClick={() => navigate("/admin/mahasiswa")}
          className="px-5 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors"
        >
          Kembali ke Tabel
        </button>
      </div>
    </Card>
  );
};

export default MahasiswaDetail;
