import { Routes, Route } from "react-router-dom";
import TuviLayout from "../layouts/TuviLayout";
import TuviResultPage from "../pages/TuviResultPage";
import MainLayout from "@layouts/MainLayout";
import LandingPage from "@pages/LandingPage";
import TuVi from "@pages/TuVi";
import Tarot from "@pages/tarot/Tarot";
import TarotSpread from "@pages/tarot/TarotSpread";
import TarotCardDetail from "@pages/tarot/TarotCardDetail";
import TarotCardList from "@pages/tarot/TarotCardList";
import TarotYesNo from "@pages/tarot/TarotYesNo";
import TarotLove from "@pages/tarot/TarotLove";
import TarotLoveSimple from "@pages/tarot/TarotLoveSimple";
import TarotLoveDeep from "@pages/tarot/TarotLoveDeep";
import TarotDaily from "@pages/tarot/TarotDaily";
import TarotOneCard from "@pages/tarot/TarotOneCard";
import NhanTuong from "@pages/nhantuong/NhanTuong";
import GioiThieu from "@pages/nhantuong/GioiThieu";
import KetQua from "@pages/nhantuong/KetQua";
import TestFaceAnalysis from "@pages/nhantuong/TestFaceAnalysis";
import SocialMedia from "@pages/SocialMedia";
import PostDetail from "@pages/PostDetail";
import CreatePost from "@pages/CreatePost";
import UserProfile from "@pages/UserProfile";
import EditProfile from "@pages/EditProfile";
import SavedPosts from "@pages/SavedPosts";
import ProtectedRoute from "@components/common/ProtectedRoute";
import TarotLayout from "@layouts/TarotLayout";
import SocialLayout from "@layouts/SocialLayout";

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
        path="/tarot/card/:id"
        element={
          <TarotLayout>
            <TarotCardDetail />
          </TarotLayout>
        }
      />
      <Route
        path="/tarot/card"
        element={
          <TarotLayout>
            <TarotCardList />
          </TarotLayout>
        }
      />
      <Route
        path="/tarot"
        element={
          <TarotLayout>
            <Tarot />
          </TarotLayout>
        }
      />
      <Route
        path="/tarot/spread"
        element={
          <TarotLayout>
            <TarotSpread />
          </TarotLayout>
        }
      />
      <Route
        path="/tarot/yes-no"
        element={
          <TarotLayout>
            <TarotYesNo />
          </TarotLayout>
        }
      />
      <Route
        path="/tarot/love"
        element={
          <TarotLayout>
            <TarotLove />
          </TarotLayout>
        }
      />
      <Route
        path="/tarot/love-simple"
        element={
          <TarotLayout>
            <TarotLoveSimple />
          </TarotLayout>
        }
      />
      <Route
        path="/tarot/love-deep"
        element={
          <TarotLayout>
            <TarotLoveDeep />
          </TarotLayout>
        }
      />
      <Route
        path="/tarot/daily"
        element={
          <TarotLayout>
            <TarotDaily />
          </TarotLayout>
        }
      />
      <Route
        path="/tarot/one-card"
        element={
          <TarotLayout>
            <TarotOneCard />
          </TarotLayout>
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
        path="/nhantuong/test"
        element={
          <MainLayout>
            <TestFaceAnalysis />
          </MainLayout>
        }
      />
      <Route element={<SocialLayout />}>
        <Route
          path="/socialmedia"
          element={
            <ProtectedRoute>
              <SocialMedia />
            </ProtectedRoute>
          }
        />
        <Route
          path="/post/create"
          element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          }
        />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/user/:id" element={<UserProfile />} />
        <Route
          path="/user/edit"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/saved-posts"
          element={
            <ProtectedRoute>
              <SavedPosts />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
