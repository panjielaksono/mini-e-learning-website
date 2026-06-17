import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "@/Pages/Auth/Login/Login";
import Mahasiswa from "@/Pages/Auth/Components/Mahasiswa.jsx";
import AdminLayout from "@/Pages/Admin/AdminLayout"; 

const Dashboard = () => <h1 className="text-2xl font-bold">Selamat Datang di Dashboard</h1>;

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="mahasiswa" />} /> 
          <Route path="mahasiswa" element={<Mahasiswa />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;