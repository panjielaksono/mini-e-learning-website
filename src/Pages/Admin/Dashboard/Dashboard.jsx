import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { getAllKelas } from "@/Utils/Apis/KelasApi";
import { getAllMahasiswa } from "@/Utils/Apis/MahasiswaApi";
import { getAllDosen } from "@/Utils/Apis/DosenApi";
import { getAllMataKuliah } from "@/Utils/Apis/MatakuliahApi";
import Heading from "@/Pages/Auth/Components/Heading";

const BLUE_PALETTE = ["#2563eb", "#3b82f6", "#60a5fa", "#1d4ed8", "#1e3a8a"];

export default function Dashboard() {
  const [kelas, setKelas] = useState([]);
  const [mahasiswa, setMahasiswa] = useState([]);
  const [dosen, setDosen] = useState([]);
  const [mataKuliah, setMataKuliah] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardRealData();
  }, []);

  const fetchDashboardRealData = async () => {
    try {
      setIsLoading(true);
      const [resKelas, resMhs, resDosen, resMatkul] = await Promise.all([
        getAllKelas(),
        getAllMahasiswa(),
        getAllDosen(),
        getAllMataKuliah(),
      ]);

      setKelas(resKelas.data?.data ?? resKelas.data ?? []);
      setMahasiswa(resMhs.data?.data ?? resMhs.data ?? []);
      setDosen(resDosen.data?.data ?? resDosen.data ?? []);
      setMataKuliah(resMatkul.data?.data ?? resMatkul.data ?? []);
    } catch (error) {
      console.error("Gagal melakukan kompilasi grafik relasional", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center text-blue-600 font-mono text-xs tracking-wider uppercase">
        Mengkalkulasi matriks grafik rencana studi...
      </div>
    );
  }

  const dosenChartData = dosen.map((d) => {
    const totalSksDiampu = kelas
      .filter((k) => k.dosen_id === d.id)
      .map((k) => mataKuliah.find((m) => m.id === k.mata_kuliah_id)?.sks || 0)
      .reduce((acc, curr) => acc + curr, 0);
    return {
      name: d.nama || d.name || "Dosen",
      "SKS Aktif": totalSksDiampu,
      "Batas Maksimal": d.max_sks || 12,
    };
  });

  const mhsChartData = mahasiswa.slice(0, 5).map((m) => {
    const totalSksDiambil = kelas
      .filter((k) => k.mahasiswa_ids?.includes(m.id))
      .map((k) => mataKuliah.find((mk) => mk.id === k.mata_kuliah_id)?.sks || 0)
      .reduce((acc, curr) => acc + curr, 0);
    return {
      name: m.nama || m.name || "Mahasiswa",
      "SKS Diambil": totalSksDiambil,
      "Maksimal SKS": m.max_sks || 20,
    };
  });

  const kelasChartData = kelas.map((k) => {
    const targetMatkul = mataKuliah.find((m) => m.id === k.mata_kuliah_id);
    const namaMatkul =
      targetMatkul?.nama || targetMatkul?.name || `Kelas ${k.nama}`;
    return {
      name: namaMatkul,
      value: k.mahasiswa_ids?.length || 0,
    };
  });

  return (
    <div className="space-y-6 p-2 font-sans text-slate-800">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">
            Total Mahasiswa
          </p>
          <h3 className="text-2xl font-black mt-1 text-slate-800 font-mono">
            {mahasiswa.length}
          </h3>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">
            Total Dosen
          </p>
          <h3 className="text-2xl font-black mt-1 text-slate-800 font-mono">
            {dosen.length}
          </h3>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">
            Katalog Matkul
          </p>
          <h3 className="text-2xl font-black mt-1 text-slate-800 font-mono">
            {mataKuliah.length}
          </h3>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          <p className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">
            Kelas Berjalan
          </p>
          <h3 className="text-2xl font-black mt-1 text-slate-800 font-mono">
            {kelas.length}
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <Heading
            as="h3"
            className="text-sm font-bold text-slate-800 mb-0.5 tracking-tight"
          >
            Beban Mengajar SKS Dosen
          </Heading>
          <p className="text-slate-400 text-xs mb-8">
            Komparasi jumlah SKS mengajar aktif terhadap batas kapasitas beban
            dosen.
          </p>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={dosenChartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                }}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="SKS Aktif" fill="#2563eb" radius={[4, 4, 0, 0]} />
              <Bar
                dataKey="Batas Maksimal"
                fill="#93c5fd"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <Heading
            as="h3"
            className="text-sm font-bold text-slate-800 mb-0.5 tracking-tight"
          >
            Keterisian SKS Rencana Studi Mahasiswa
          </Heading>
          <p className="text-slate-400 text-xs mb-8">
            Penyandingan jumlah akumulasi SKS yang diambil terhadap jatah
            maksimal SKS mahasiswa.
          </p>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={mhsChartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                }}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="SKS Diambil" fill="#2563eb" radius={[4, 4, 0, 0]} />
              <Bar
                dataKey="Maksimal SKS"
                fill="#93c5fd"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <Heading
          as="h3"
          className="text-sm font-bold text-slate-800 mb-0.5 tracking-tight"
        >
          Distribusi Kepadatan Kuota Kelas Kuliah
        </Heading>
        <p className="text-slate-400 text-xs mb-6">
          Proporsi plotting pembagian jumlah total mahasiswa aktif yang
          terdaftar per kelas mata kuliah.
        </p>

        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={kelasChartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="45%"
              outerRadius={95}
              innerRadius={55}
              paddingAngle={4}
            >
              {kelasChartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={BLUE_PALETTE[index % BLUE_PALETTE.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: 11 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
