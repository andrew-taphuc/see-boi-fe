import React, { useState, useEffect } from 'react';
import axiosInstance from '@utils/axiosInstance';
import { Search, Trash2, Eye, User as UserIcon, FileText, MessageCircle, Users } from 'lucide-react';
import { useDebounce } from '@hooks/useDebounce';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const limit = 10;

  const debouncedSearchTerm = useDebounce(searchTerm, 1000);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, debouncedSearchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/user/admin/all', {
        params: {
          search: debouncedSearchTerm || undefined,
          page: currentPage,
          limit: limit,
        },
      });

      if (response.data) {
        setUsers(response.data.users);
        setTotal(response.data.total);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Không thể tải danh sách người dùng!');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác!')) return;
    
    try {
      await axiosInstance.delete(`/user/admin/${userId}`);
      alert('Xóa người dùng thành công!');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Có lỗi xảy ra khi xóa người dùng!');
    }
  };

  const handleViewStats = async (userId) => {
    try {
      const response = await axiosInstance.get(`/user/admin/${userId}/stats`);
      setSelectedUser(response.data);
      setShowStatsModal(true);
    } catch (error) {
      console.error('Error fetching user stats:', error);
      alert('Không thể tải thông tin người dùng!');
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset về trang 1 khi search
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý người dùng</h1>
        <div className="text-sm text-gray-600">
          Tổng số: <span className="font-semibold">{total}</span> người dùng
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, username, email..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          {searchTerm && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
              Đang tìm kiếm...
            </div>
          )}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Người dùng
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Level/XP
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hoạt động
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hành động
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {user.avatarUrl ? (
                          <img className="h-10 w-10 rounded-full object-cover" src={user.avatarUrl} alt="" />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <UserIcon size={20} className="text-gray-600" />
                          </div>
                        )}
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                        <div className="text-sm text-gray-500">@{user.userName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="text-xs">
                      <div>Level {user.level}</div>
                      <div>{user.xp.toLocaleString()} XP</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="text-xs space-y-1">
                      <div className="flex items-center gap-1">
                        <FileText size={14} className="text-blue-500" />
                        <span>{user._count.posts} bài viết</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle size={14} className="text-green-500" />
                        <span>{user._count.comments} bình luận</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users size={14} className="text-purple-500" />
                        <span>{user._count.followsTo} followers</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewStats(user.id)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Xem chi tiết"
                      >
                        <Eye size={18} />
                      </button>
                      {/* <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Xóa"
                      >
                        <Trash2 size={18} />
                      </button> */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Trước
          </button>
          <span className="px-4 py-2 text-sm text-gray-700">
            Trang {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sau →
          </button>
        </div>
      )}

      {users.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Không tìm thấy người dùng nào
        </div>
      )}

      {/* User Stats Modal */}
      {showStatsModal && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Thông tin chi tiết</h2>
              <button
                onClick={() => setShowStatsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              {/* User Info */}
              <div className="flex items-center gap-4 pb-4 border-b">
                {selectedUser.avatarUrl ? (
                  <img 
                    src={selectedUser.avatarUrl} 
                    alt={selectedUser.fullName}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center">
                    <UserIcon size={40} className="text-gray-600" />
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-semibold">{selectedUser.fullName}</h3>
                  <p className="text-gray-600">@{selectedUser.userName}</p>
                  <p className="text-sm text-gray-500">{selectedUser.email}</p>
                  <span className={`inline-block mt-2 px-3 py-1 text-xs rounded-full ${
                    selectedUser.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {selectedUser.role}
                  </span>
                </div>
              </div>

              {/* Bio */}
              {selectedUser.bio && (
                <div>
                  <h4 className="font-semibold mb-2">Giới thiệu</h4>
                  <p className="text-gray-600">{selectedUser.bio}</p>
                </div>
              )}

              {/* Level & XP */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Level</p>
                  <p className="text-2xl font-bold text-amber-600">{selectedUser.level}</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">XP</p>
                  <p className="text-2xl font-bold text-blue-600">{selectedUser.xp.toLocaleString()}</p>
                </div>
              </div>

              {/* Stats Grid */}
              <div>
                <h4 className="font-semibold mb-3">Thống kê hoạt động</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-gray-800">{selectedUser.stats.totalPosts}</p>
                    <p className="text-sm text-gray-600">Bài viết</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-gray-800">{selectedUser.stats.totalComments}</p>
                    <p className="text-sm text-gray-600">Bình luận</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-gray-800">{selectedUser.stats.totalLikes}</p>
                    <p className="text-sm text-gray-600">Lượt thích</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-gray-800">{selectedUser.stats.followers}</p>
                    <p className="text-sm text-gray-600">Followers</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-gray-800">{selectedUser.stats.following}</p>
                    <p className="text-sm text-gray-600">Following</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center">
                    <p className="text-2xl font-bold text-gray-800">{selectedUser.stats.reports}</p>
                    <p className="text-sm text-gray-600">Báo cáo</p>
                  </div>
                </div>
              </div>

              {/* Created At */}
              <div className="text-sm text-gray-500 pt-4 border-t">
                Tham gia: {new Date(selectedUser.createdAt).toLocaleString('vi-VN')}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowStatsModal(false)}
                className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
