import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "@/Pages/Auth/Components/Input";
import Label from "@/Pages/Auth/Components/Label";
import Button from "@/Pages/Auth/Components/Button";
import Heading from "@/Pages/Auth/Components/Heading";
import Form from "@/Pages/Auth/Components/Form";
import { registerApi } from "@/Utils/Apis/AuthApi";
import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";
import SilkAurora from "@/Pages/Auth/Components/SilkAurora";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "Guest",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, id: String(Date.now()) };

      await registerApi(payload);
      toastSuccess("Registrasi akun berhasil! Silakan login.");
      navigate("/");
    } catch (err) {
      toastError("Gagal melakukan registrasi, coba periksa database server");
    }
  };

  return (
    <div className="w-full min-h-screen flex bg-slate-50 font-sans antialiased select-none">
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-end p-12">
        <SilkAurora
          baseColor="#020617"
          midColor="#0b1329"
          sheenColor="#3b82f6"
          accentColor="#1d4ed8"
          speed={0.6}
          intensity={0.8}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent z-10 pointer-events-none" />
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

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-16 bg-white">
        <div className="w-full max-w-sm space-y-6">
          <div>
            <Heading
              as="h2"
              className="text-2xl font-black text-slate-800 tracking-tight mb-0"
            >
              Daftar Akun
            </Heading>
            <p className="text-slate-400 text-xs mt-1.5">
              Lengkapi formulir di bawah untuk mendaftarkan akun baru Anda ke
              dalam sistem e-learning.
            </p>
          </div>

          <Form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label
                htmlFor="register-name"
                className="text-xs font-bold text-slate-500"
              >
                Nama Lengkap
              </Label>
              <Input
                type="text"
                name="name"
                id="register-name"
                value={form.name}
                onChange={handleChange}
                placeholder="Masukkan nama lengkap"
                required
                className="mt-1 border-slate-200 focus:ring-blue-600"
              />
            </div>

            <div>
              <Label
                htmlFor="register-email"
                className="text-xs font-bold text-slate-500"
              >
                Alamat Email
              </Label>
              <Input
                type="email"
                name="email"
                id="register-email"
                value={form.email}
                onChange={handleChange}
                placeholder="nama@mail.com"
                required
                className="mt-1 border-slate-200 focus:ring-blue-600"
              />
            </div>

            <div>
              <Label
                htmlFor="register-password"
                className="text-xs font-bold text-slate-500"
              >
                Kata Sandi
              </Label>
              <Input
                type="password"
                name="password"
                id="register-password"
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
              Daftar Sekarang
            </Button>
          </Form>

          <div className="text-center text-xs text-slate-400 pt-4 border-t border-slate-100">
            Sudah memiliki akun resmi?{" "}
            <button
              type="button"
              onClick={() => navigate("/")}
              className="text-blue-600 font-bold hover:underline bg-transparent border-none p-0 cursor-pointer ml-1"
            >
              Masuk di sini
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
