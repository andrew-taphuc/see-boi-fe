import { Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import LandingPage from "../pages/LandingPage";
import TuVi from "../pages/TuVi";
import Tarot from "../pages/Tarot";
import NhanTuong from "../pages/nhantuong/NhanTuong";
import GioiThieu from "../pages/nhantuong/GioiThieu";
import KetQua from "../pages/nhantuong/KetQua";
import SocialMedia from "../pages/SocialMedia";
import Login from "../components/Login&Register/Login";
import Register from "../components/Login&Register/Register";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout><LandingPage /></MainLayout>} />
      <Route path="/landingpage" element={<MainLayout><LandingPage /></MainLayout>} />
      <Route path="/tuvi" element={<MainLayout><TuVi /></MainLayout>} />
      <Route path="/tarot" element={<MainLayout><Tarot /></MainLayout>} />
      <Route path="/nhantuong" element={<MainLayout><NhanTuong /></MainLayout>} />
      <Route path="/nhantuong/gioi-thieu" element={<MainLayout><GioiThieu /></MainLayout>} />
      <Route path="/nhantuong/ket-qua" element={<MainLayout><KetQua /></MainLayout>} />
      <Route path="/socialmedia" element={<MainLayout><SocialMedia /></MainLayout>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
};

export default AppRoutes;
