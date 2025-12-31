import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Users, Bookmark, PenSquare, Edit2, Settings, Tag } from "lucide-react";
import { useAuth } from "@context/AuthContext";
import FollowListModal from "@components/userProfile/FollowListModal";

const UserMenu = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [followModalOpen, setFollowModalOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-xl p-6 shadow-sm space-y-2">
        {/* User Info Card */}
        <Link
          to={`/user/${currentUser?.id}`}
          className="block p-3 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <div className="flex items-center gap-3 mb-2">
            <img
              src={
                currentUser?.avatarUrl ||
                `https://ui-avatars.com/api/?name=${currentUser?.userName || "User"
                }&background=4267B2&color=fff`
              }
              alt={currentUser?.userName}
              className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">
                {currentUser?.userName}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {currentUser?.email}
              </p>
            </div>
          </div>
          {/* Level Badge */}
          <div className="flex items-center gap-2 px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full w-fit">
            <svg
              className="w-3 h-3 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-white font-bold text-xs">
              Level {currentUser?.level ?? 1}
            </span>
          </div>
          {/* XP Progress */}
          <div className="mt-2">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
              <span>XP: {currentUser?.xp ?? 0}</span>
              <span>{Math.floor(((currentUser?.xp ?? 0) % 1000) / 10)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                style={{ width: `${((currentUser?.xp ?? 0) % 1000) / 10}%` }}
              />
            </div>
          </div>
        </Link>

        {/* Action Buttons */}
        <div className="space-y-1 pt-2 pb-2 border-b border-gray-200">
          <button
            onClick={() => navigate("/post/create")}
            className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg w-full transition-colors"
          >
            <div className="w-6 h-6 flex items-center justify-center">
              <PenSquare className="text-green-600" size={20} />
            </div>
            <span className="text-sm font-medium">Đăng bài</span>
          </button>
          
          <Link
            to="/user/edit"
            className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg w-full transition-colors"
          >
            <div className="w-6 h-6 flex items-center justify-center">
              <Edit2 className="text-blue-500" size={20} />
            </div>
            <span className="text-sm font-medium">Chỉnh sửa</span>
          </Link>
          
          <Link
            to="/settings"
            className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg w-full transition-colors"
          >
            <div className="w-6 h-6 flex items-center justify-center">
              <Settings className="text-gray-600" size={20} />
            </div>
            <span className="text-sm font-medium">Cài đặt</span>
          </Link>
          
          <Link
            to="/following-tags"
            className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg w-full transition-colors"
          >
            <div className="w-6 h-6 flex items-center justify-center">
              <Tag className="text-blue-600" size={20} />
            </div>
            <span className="text-sm font-medium">Tags theo dõi</span>
          </Link>
        </div>

        {/* Người theo dõi */}
        <button
          onClick={() => setFollowModalOpen(true)}
          className="flex items-center gap-3 p-2 hover:bg-gray-200 rounded-lg w-full"
        >
          <Users className="text-blue-600" size={24} />
          <span>Người theo dõi</span>
        </button>

        {/* Đã lưu */}
        <Link
          to="/saved-posts"
          className="flex items-center gap-3 p-2 hover:bg-gray-200 rounded-lg w-full"
        >
          <Bookmark className="text-purple-500" size={24} />
          <span>Đã lưu</span>
        </Link>
      </div>

      {/* Follow List Modal */}
      {currentUser && (
        <FollowListModal
          isOpen={followModalOpen}
          onClose={() => setFollowModalOpen(false)}
          userId={currentUser.id}
          initialTab="followers"
        />
      )}
    </>
  );
};

export default UserMenu;

