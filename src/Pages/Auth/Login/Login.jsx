import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import Input from "@/Pages/Auth/Components/Input";
import Label from "@/Pages/Auth/Components/Label";
import Button from "@/Pages/Auth/Components/Button";
import Heading from "@/Pages/Auth/Components/Heading";
import Form from "@/Pages/Auth/Components/Form";
import { login } from "@/Utils/Apis/AuthApi";
import { useAuthStateContext } from "@/Utils/Contexts/AuthContext";
import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";

// 🔥 STEP 1: Import gambar riil dari folder assets lu blay
import virtualImg from "@/assets/virtual.png";
import logoImg from "@/assets/logo.png"; // Import logo baru lu di sini blay
import SilkAurora from "@/Pages/Auth/Components/SilkAurora";
const Login = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuthStateContext();
  const [form, setForm] = useState({ email: "", password: "" });

  if (user) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = await login(form.email, form.password);

      const userPermissions = userData?.permission || [];
      if (userPermissions.length === 0) {
        toastError(
          "Akses ditolak! Akun Anda belum dikonfigurasi hak aksesnya blay.",
        );
        return;
      }

      setUser(userData);
      toastSuccess(`Login berhasil! Selamat datang ${userData.name || "!!"}.`);

      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 50);
    } catch (err) {
      toastError(err.message || "Gagal terhubung ke database server!");
    }
  };

  return (
    <div className="w-full min-h-screen flex bg-slate-50 font-sans antialiased select-none">
      {/* ================= SEKTOR KIRI: INTERACTIVE WEBGL SILK AURORA ================= */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-end p-12">
        {/* Jalankan Mesin Shader Tanpa Install Library Eksternal Blay */}
        <SilkAurora
          baseColor="#020617" // Slate 950 Gelap murni
          midColor="#0b1329" // Navy Alus Kampus
          sheenColor="#3b82f6" // Pantulan Cahaya Biru
          accentColor="#1d4ed8" // Gradasi Aksen Biru Tua
          speed={0.6} // Aliran lambat elegan
          intensity={0.8}
        />

        {/* Ambient Dark Overlay di atas Canvas agar Teks Pop-Out */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent z-10 pointer-events-none" />

        {/* BUNDEL TEKS MINIMALIS DI POJOK BAWAH */}
        <div className="relative z-20 max-w-sm text-left space-y-2 pointer-events-none">
          <h1 className="text-xl font-black tracking-widest font-mono uppercase text-white drop-shadow-md">
            E-Learning System
          </h1>
          <p className="text-slate-300/90 text-xs leading-relaxed font-medium drop-shadow-sm">
            Portal manajemen KRS, plotting jatah SKS dosen, dan visualisasi
            analitik kurikulum terpadu program studi.
          </p>
        </div>
      </div>
      {/* ================= SEKTOR KANAN: AREA FORM LOGIN ================= */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-16 bg-white">
        <div className="w-full max-w-sm space-y-6">
          <div>
            <Heading
              as="h2"
              className="text-2xl font-black text-slate-800 tracking-tight mb-0"
            >
              Login
            </Heading>
            <p className="text-slate-400 text-xs mt-1.5">
              Masukkan kredensial akun terdaftar Anda untuk masuk ke panel
              kendali dashboard admin.
            </p>
          </div>

          <Form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label
                htmlFor="email"
                className="text-xs font-bold text-slate-500"
              >
                Alamat Email
              </Label>
              <Input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="nama@mail.com"
                required
                className="mt-1 border-slate-200 focus:ring-blue-600"
              />
            </div>

            <div>
              <Label
                htmlFor="password"
                className="text-xs font-bold text-slate-500"
              >
                Kata Sandi
              </Label>
              <Input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="mt-1 border-slate-200 focus:ring-blue-600"
              />
            </div>

            <Button
              type="submit"
              className="w-full py-2.5 rounded-xl font-bold mt-2 shadow-sm transition-all hover:bg-blue-700 cursor-pointer"
            >
              Masuk Aplikasi
            </Button>
          </Form>

          <div className="text-center text-xs text-slate-400 pt-4 border-t border-slate-100">
            Belum memiliki akun resmi?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="text-blue-600 font-bold hover:underline bg-transparent border-none p-0 cursor-pointer ml-1"
            >
              Daftar Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
