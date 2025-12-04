import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import LandingPage from "../pages/LandingPage";
import TuVi from "../pages/TuVi";
import Tarot from "../pages/Tarot";
import NhanTuong from "../pages/NhanTuong";
import SocialMedia from "../pages/SocialMedia";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout><LandingPage /></MainLayout>} />
      <Route path="/landingpage" element={<MainLayout><LandingPage /></MainLayout>} />
      <Route path="/tuvi" element={<MainLayout><TuVi /></MainLayout>} />
      <Route path="/tarot" element={<MainLayout><Tarot /></MainLayout>} />
      <Route path="/nhantuong" element={<MainLayout><NhanTuong /></MainLayout>} />
      <Route path="/socialmedia" element={<MainLayout><SocialMedia /></MainLayout>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
};

export default AppRoutes;
