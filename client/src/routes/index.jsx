import { Routes, Route } from "react-router-dom";
import TuviLayout from "../layouts/TuviLayout";
import TuviResultPage from "../pages/TuviResultPage";
import MainLayout from "@layouts/MainLayout";
import LandingPage from "@pages/LandingPage";
import TuVi from "@pages/TuVi";
import Tarot from "@pages/Tarot";
import NhanTuong from "@pages/nhantuong/NhanTuong";
import GioiThieu from "@pages/nhantuong/GioiThieu";
import KetQua from "@pages/nhantuong/KetQua";
import SocialMedia from "@pages/SocialMedia";
import PostDetail from "@pages/PostDetail";
import CreatePost from "@pages/CreatePost";
import UserProfile from "@pages/UserProfile";
import EditProfile from "@pages/EditProfile";
import ProtectedRoute from "@components/common/ProtectedRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <MainLayout>
            <LandingPage />
          </MainLayout>
        }
      />
      <Route
        path="/landingpage"
        element={
          <MainLayout>
            <LandingPage />
          </MainLayout>
        }
      />
      <Route
        path="/tuvi"
        element={
          <TuviLayout>
            <TuVi />
          </TuviLayout>
        }
      />
      <Route
        path="/tuvi/result"
        element={
          <ProtectedRoute>
            <TuviLayout>
              <TuviResultPage />
            </TuviLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tuvi/result/:chartId"
        element={
          <ProtectedRoute>
            <TuviLayout>
              <TuviResultPage />
            </TuviLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/tarot"
        element={
          <MainLayout>
            <Tarot />
          </MainLayout>
        }
      />
      <Route
        path="/nhantuong"
        element={
          <MainLayout>
            <NhanTuong />
          </MainLayout>
        }
      />
      <Route
        path="/nhantuong/gioi-thieu"
        element={
          <MainLayout>
            <GioiThieu />
          </MainLayout>
        }
      />
      <Route
        path="/nhantuong/ket-qua"
        element={
          <MainLayout>
            <KetQua />
          </MainLayout>
        }
      />
      <Route
        path="/socialmedia"
        element={
          <ProtectedRoute>
            <MainLayout>
              <SocialMedia />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/post/create"
        element={
          <MainLayout>
            <CreatePost />
          </MainLayout>
        }
      />
      <Route
        path="/post/:id"
        element={
          <MainLayout>
            <PostDetail />
          </MainLayout>
        }
      />
      <Route
        path="/user/:id"
        element={
          <MainLayout>
            <UserProfile />
          </MainLayout>
        }
      />
      <Route
        path="/user/edit"
        element={
          <ProtectedRoute>
            <MainLayout>
              <EditProfile />
            </MainLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
