import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import TuviLayout from "../layouts/TuviLayout";
import MainLayout from "@layouts/MainLayout";
import ProtectedRoute from "@components/common/ProtectedRoute";
import TarotLayout from "@layouts/TarotLayout";
import SocialLayout from "@layouts/SocialLayout";
import AdminLayout from "@layouts/AdminLayout";

// LandingPage không lazy load vì là trang đầu tiên
import LandingPage from "@pages/LandingPage";

// Lazy load tất cả các pages khác
const TuviResultPage = lazy(() => import("../pages/TuviResultPage"));
const TuVi = lazy(() => import("@pages/TuVi"));
const Tarot = lazy(() => import("@pages/tarot/Tarot"));
const TarotSpread = lazy(() => import("@pages/tarot/TarotSpread"));
const TarotCardDetail = lazy(() => import("@pages/tarot/TarotCardDetail"));
const TarotCardList = lazy(() => import("@pages/tarot/TarotCardList"));
const TarotYesNo = lazy(() => import("@pages/tarot/TarotYesNo"));
const TarotLove = lazy(() => import("@pages/tarot/TarotLove"));
const TarotLoveSimple = lazy(() => import("@pages/tarot/TarotLoveSimple"));
const TarotLoveDeep = lazy(() => import("@pages/tarot/TarotLoveDeep"));
const TarotDaily = lazy(() => import("@pages/tarot/TarotDaily"));
const TarotOneCard = lazy(() => import("@pages/tarot/TarotOneCard"));
const NhanTuong = lazy(() => import("@pages/nhantuong/NhanTuong"));
const GioiThieu = lazy(() => import("@pages/nhantuong/GioiThieu"));
const KetQua = lazy(() => import("@pages/nhantuong/KetQua"));
const TestFaceAnalysis = lazy(() => import("@pages/nhantuong/TestFaceAnalysis"));
const SocialMedia = lazy(() => import("@pages/SocialMedia"));
const PostDetail = lazy(() => import("@pages/PostDetail"));
const CreatePost = lazy(() => import("@pages/CreatePost"));
const EditPost = lazy(() => import("@pages/EditPost"));
const DraftList = lazy(() => import("@pages/DraftList"));
const UserProfile = lazy(() => import("@pages/UserProfile"));
const EditProfile = lazy(() => import("@pages/EditProfile"));
const SavedPosts = lazy(() => import("@pages/SavedPosts"));
const TagPage = lazy(() => import("@pages/TagPage"));
const MyFollowingTagsPage = lazy(() => import("@pages/MyFollowingTagsPage"));
const SearchResults = lazy(() => import("@pages/SearchResults"));
const Dashboard = lazy(() => import("@pages/admin/Dashboard"));
const UserManagement = lazy(() => import("@pages/admin/UserManagement"));
const ReportManagement = lazy(() => import("@pages/admin/ReportManagement"));
const PostCommentManagement = lazy(() => import("@pages/admin/PostCommentManagement"));
const AdminProfile = lazy(() => import("@pages/admin/AdminProfile"));

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
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
        <Route path="/search" element={<SearchResults />} />
        <Route
          path="/drafts"
          element={
            <ProtectedRoute>
              <DraftList />
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
        <Route
          path="/post/:id/edit"
          element={
            <ProtectedRoute>
              <EditPost />
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
        <Route path="/tag/:id" element={<TagPage />} />
        <Route
          path="/following-tags"
          element={
            <ProtectedRoute>
              <MyFollowingTagsPage />
            </ProtectedRoute>
          }
        />
      </Route>
      
      {/* Admin Routes */}
      <Route element={<AdminLayout />}>
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <UserManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute>
              <ReportManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/posts"
          element={
            <ProtectedRoute>
              <PostCommentManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <ProtectedRoute>
              <AdminProfile />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
    </Suspense>
  );
};

export default AppRoutes;
